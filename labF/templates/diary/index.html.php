<?php

/** @var \App\Model\Diary[] $diaries */
/** @var \App\Service\Router $router */

$title = 'Diary List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Diaries List</h1>

    <a href="<?= $router->generatePath('diary-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($diaries as $diary): ?>
            <li><h3><?= $diary->getDate() . "\t" . $diary->getSubject() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('diary-show', ['id' => $diary->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('diary-edit', ['id' => $diary->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
