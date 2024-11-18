<?php

/** @var \App\Model\Diary $diary */
/** @var \App\Service\Router $router */

$title = "Edit Diary {$diary->getDate()} {$diary->getSubject()} ({$diary->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('diary-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="diary-edit">
        <input type="hidden" name="id" value="<?= $diary->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('diary-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('diary-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="diary-delete">
                <input type="hidden" name="id" value="<?= $diary->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
