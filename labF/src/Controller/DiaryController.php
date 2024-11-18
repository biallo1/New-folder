<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Diary;
use App\Service\Router;
use App\Service\Templating;

class DiaryController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $diaries = Diary::findAll();
        $html = $templating->render('diary/index.html.php', [
            'diaries' => $diaries,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $diary = Diary::fromArray($requestPost);
            // @todo missing validation
            $diary->save();

            $path = $router->generatePath('diary-index');
            $router->redirect($path);
            return null;
        } else {
            $diary = new Diary();
        }

        $html = $templating->render('diary/create.html.php', [
            'diary' => $diary,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $diaryId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $diary = Diary::find($diaryId);
        if (! $diary) {
            throw new NotFoundException("Missing diary with id $diaryId");
        }

        if ($requestPost) {
            $diary->fill($requestPost);
            // @todo missing validation
            $diary->save();

            $path = $router->generatePath('diary-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('diary/edit.html.php', [
            'diary' => $diary,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $diaryId, Templating $templating, Router $router): ?string
    {
        $diary = Diary::find($diaryId);
        if (! $diary) {
            throw new NotFoundException("Missing diary with id $diaryId");
        }

        $html = $templating->render('diary/show.html.php', [
            'diary' => $diary,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $diaryId, Router $router): ?string
    {
        $diary = Diary::find($diaryId);
        if (! $diary) {
            throw new NotFoundException("Missing diary with id $diaryId");
        }

        $diary->delete();
        $path = $router->generatePath('diary-index');
        $router->redirect($path);
        return null;
    }
}
