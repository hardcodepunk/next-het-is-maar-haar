<?php
declare(strict_types=1);

const ROOT = '/data/sites/web/hardcodepunkbe/subsites/hetismaarhaar.hardcodepunk.be';
const PRIVATE_DIR = '/data/sites/web/hardcodepunkbe/hetismaarhaar-staging-deploy';
const MAX_UPLOAD = 32 * 1024 * 1024;
const MAX_RELEASE = 96 * 1024 * 1024;
const STATIC_TYPE = '/\.(avif|css|gif|html|ico|jpeg|jpg|js|json|mjs|mp4|ogv|pdf|png|svg|ttf|txt|webmanifest|webm|webp|woff|woff2|xml)$/iD';

header('Content-Type: application/json');
ini_set('display_errors', '0');
umask(0077);

function respond(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), "\n";
}

function mainRevision(): string
{
    $connection = curl_init('https://api.github.com/repos/hardcodepunk/next-het-is-maar-haar/git/ref/heads/main');
    curl_setopt_array($connection, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'Het-is-maar-haar-staging',
        CURLOPT_HTTPHEADER => ['Accept: application/vnd.github+json'],
        CURLOPT_TIMEOUT => 12,
    ]);
    $body = curl_exec($connection);
    if (!is_string($body) || curl_getinfo($connection, CURLINFO_RESPONSE_CODE) !== 200) {
        throw new RuntimeException('Unable to verify GitHub main.', 503);
    }
    $response = json_decode($body, true, 16, JSON_THROW_ON_ERROR);
    return (string) ($response['object']['sha'] ?? '');
}

function deploymentPath(string $name): string
{
    $name = rtrim($name, '/');
    $lower = strtolower($name);
    if (strlen($name) > 220
        || !preg_match('~^[A-Za-z0-9_-][A-Za-z0-9_.-]*(/[A-Za-z0-9_-][A-Za-z0-9_.-]*)*$~D', $name)
        || preg_match('~(?:^|/)_staging-(?:deploy\.php|revision\.json)(?:/|$)|\.(?:php[0-9]*|phtml|phar|cgi|fcgi|pl)(?:[./]|$)~D', $lower)
    ) {
        throw new RuntimeException('Invalid static path.', 422);
    }
    return $name;
}

function ensureParents(string $root, string $name, bool $create): void
{
    $parts = explode('/', $name);
    array_pop($parts);
    foreach ($parts as $part) {
        $root .= '/' . $part;
        if (is_link($root) || (file_exists($root) && !is_dir($root))) {
            throw new RuntimeException('Invalid destination directory.', 422);
        }
        if (!is_dir($root) && $create && (!mkdir($root, 0700) || !chmod($root, 0755))) {
            throw new RuntimeException('Could not create destination directory.', 500);
        }
    }
}

function publish(string $source, string $destination): void
{
    if (!chmod($source, 0644) || !rename($source, $destination)) {
        throw new RuntimeException('Could not publish generated file.', 500);
    }
}

function unpackRelease(string $archive, string $directory): array
{
    $zip = new ZipArchive();
    if ($zip->open($archive, ZipArchive::RDONLY | ZipArchive::CHECKCONS) !== true) {
        throw new RuntimeException('Invalid ZIP archive.', 422);
    }
    if ($zip->numFiles > 2000) {
        throw new RuntimeException('Too many archive entries.', 422);
    }
    $total = 0;
    $files = [];
    for ($index = 0; $index < $zip->numFiles; $index++) {
        $stat = $zip->statIndex($index);
        if ($stat === false) {
            throw new RuntimeException('Invalid ZIP entry.', 422);
        }
        $name = deploymentPath($stat['name']);
        if (str_ends_with($stat['name'], '/')) {
            continue;
        }
        $total += $stat['size'];
        if ($total > MAX_RELEASE || !preg_match(STATIC_TYPE, $name) || isset($files[$name])) {
            throw new RuntimeException('ZIP exceeds the static release limits.', 422);
        }
        ensureParents(ROOT, $name, false);
        $destination = ROOT . '/' . $name;
        if (is_link($destination) || (file_exists($destination) && !is_file($destination))) {
            throw new RuntimeException('Invalid file destination.', 422);
        }
        $source = $zip->getStreamIndex($index);
        $temporary = $directory . '/file-' . $index;
        $target = fopen($temporary, 'xb');
        if ($source === false || $target === false) {
            throw new RuntimeException('Could not read archive entry.', 422);
        }
        $bytes = stream_copy_to_stream($source, $target, $stat['size'] + 1);
        fclose($source);
        fclose($target);
        if ($bytes !== $stat['size']) {
            throw new RuntimeException('Incorrect ZIP entry size.', 422);
        }
        $files[$name] = $temporary;
    }
    $zip->close();
    if (!isset($files['index.html']) || filesize($files['index.html']) === 0) {
        throw new RuntimeException('Missing generated homepage.', 422);
    }
    foreach (array_keys($files) as $name) {
        for ($parent = dirname($name); $parent !== '.'; $parent = dirname($parent)) {
            if (isset($files[$parent])) {
                throw new RuntimeException('Conflicting ZIP paths.', 422);
            }
        }
    }
    return $files;
}

$scratch = null;
try {
    if (($_SERVER['REMOTE_USER'] ?? $_SERVER['PHP_AUTH_USER'] ?? '') !== 'staging-deploy') {
        throw new RuntimeException('Deploy credential required.', 403);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        throw new RuntimeException('Use POST to publish a release.', 405);
    }
    $revision = $_SERVER['HTTP_X_DEPLOY_COMMIT'] ?? '';
    $run = $_SERVER['HTTP_X_DEPLOY_RUN'] ?? '';
    if (!preg_match('/^[a-f0-9]{40}$/D', $revision) || !preg_match('/^[0-9]{1,20}$/D', $run)
        || ($_SERVER['CONTENT_TYPE'] ?? '') !== 'application/zip') {
        throw new RuntimeException('Invalid release metadata.', 400);
    }
    $size = filter_var($_SERVER['CONTENT_LENGTH'] ?? '', FILTER_VALIDATE_INT);
    if ($size === false || $size < 1 || $size > MAX_UPLOAD) {
        throw new RuntimeException('Invalid ZIP upload size.', 413);
    }
    if (realpath(ROOT) !== ROOT
        || !str_contains((string) file_get_contents(ROOT . '/.htaccess'), 'Require valid-user')) {
        throw new RuntimeException('Staging protection unavailable.', 503);
    }

    $lock = fopen(PRIVATE_DIR . '/deploy.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
        throw new RuntimeException('A deployment is already running.', 503);
    }
    $scratch = PRIVATE_DIR . '/incoming-' . bin2hex(random_bytes(12));
    if (!mkdir($scratch, 0700)) {
        throw new RuntimeException('Could not allocate a release directory.', 500);
    }
    $source = fopen('php://input', 'rb');
    $archive = fopen($scratch . '/release.zip', 'xb');
    if ($source === false || $archive === false) {
        throw new RuntimeException('Could not receive the ZIP archive.', 500);
    }
    $bytes = stream_copy_to_stream($source, $archive, $size + 1);
    fclose($source);
    fclose($archive);
    if ($bytes !== $size) {
        throw new RuntimeException('The ZIP upload was incomplete.', 400);
    }
    $files = unpackRelease($scratch . '/release.zip', $scratch);
    if (mainRevision() !== $revision) {
        throw new RuntimeException('This revision is no longer GitHub main.', 409);
    }
    $marker = [
        'commit' => $revision,
        'deployed_at' => gmdate('c'),
        'index_sha256' => hash_file('sha256', $files['index.html']),
        'file_count' => count($files),
        'trigger' => 'github-actions',
        'run_id' => $run,
    ];
    if (file_put_contents($scratch . '/revision.json', json_encode($marker, JSON_THROW_ON_ERROR) . "\n") === false
        || file_put_contents($scratch . '/deployed.sha', $revision . "\n") === false) {
        throw new RuntimeException('Could not prepare release metadata.', 500);
    }
    foreach ($files as $name => $temporary) {
        if ($name !== 'index.html') {
            ensureParents(ROOT, $name, true);
            publish($temporary, ROOT . '/' . $name);
        }
    }
    publish($files['index.html'], ROOT . '/index.html');
    publish($scratch . '/revision.json', ROOT . '/_staging-revision.json');
    if (!rename($scratch . '/deployed.sha', PRIVATE_DIR . '/deployed.sha')) {
        throw new RuntimeException('Could not record the deployed revision.', 500);
    }
    respond(200, $marker);
} catch (Throwable $error) {
    $status = $error->getCode();
    if ($status < 400 || $status > 599) {
        error_log('Het is maar haar staging deploy: ' . $error->getMessage());
        respond(500, ['error' => 'Staging deployment failed.']);
    } else {
        respond($status, ['error' => $error->getMessage()]);
    }
} finally {
    if ($scratch !== null && is_dir($scratch)) {
        foreach (new FilesystemIterator($scratch) as $remaining) {
            unlink($remaining->getPathname());
        }
        rmdir($scratch);
    }
}
