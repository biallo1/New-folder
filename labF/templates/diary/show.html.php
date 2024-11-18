<?php

/** @var \App\Model\Diary $diary */
/** @var \App\Service\Router $router */

$title = "{$diary->getDate()} {$diary->getSubject()} ({$diary->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $diary->getDate() . "\t" . $diary->getSubject() ?></h1>
    <article>
        <?= $diary->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('diary-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('diary-edit', ['id'=> $diary->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
