<?php
     
function getFilesFromFolder($folderPath) {
    $files = [];
    if (is_dir($folderPath)) {
        foreach (scandir($folderPath) as $file) {
            if ($file !== '.' && $file !== '..' && is_file($folderPath . DIRECTORY_SEPARATOR . $file)) {
                $files[] = $file;
            }
        }
    }
    return $files;
}

// Beispiel-Aufruf:
$uploadsFolderImg = __DIR__ . '/../../uploads/img';
$uploadsFolderVideo = __DIR__ . '/../../uploads/video';

$fileListImg = getFilesFromFolder($uploadsFolderImg);
$fileListVideo = getFilesFromFolder($uploadsFolderVideo);

$allFiles = array_merge($fileListImg, $fileListVideo);

echo json_encode($allFiles);

?>