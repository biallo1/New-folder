<?php
namespace App\Model;

use App\Service\Config;

class Diary
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $date = null;
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Diary
    {
        $this->id = $id;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): Diary
    {
        $this->subject = $subject;

        return $this;
    }

    public function getDate(): ?string
    {
        return $this->date;
    }

    public function setDate(?string $date): Diary
    {
        $this->date = $date;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Diary
    {
        $this->content = $content;

        return $this;
    }

    public static function fromArray($array): Diary
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Diary
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['date'])) {
            $this->setDate($array['date']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM diary';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $diaries = [];
        $diariesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($diariesArray as $diaryArray) {
            $diaries[] = self::fromArray($diaryArray);
        }

        return $diaries;
    }

    public static function find($id): ?Diary
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM diary WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $diaryArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $diaryArray) {
            return null;
        }
        $diary = Diary::fromArray($diaryArray);

        return $diary;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO diary (date, subject, content) VALUES (:date, :subject, :content)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'date' => $this->getDate(),
                'subject' => $this->getSubject(),
                'content' => $this->getContent(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE diary SET date = :date, subject = :subject, content = :content WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':date' => $this->getDate(),
                ':subject' => $this->getSubject(),
                ':content' => $this->getContent(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM diary WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setContent(null);
        $this->setDate(null);
    }
}
