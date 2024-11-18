<?php
    /** @var $diary ?\App\Model\Diary */
?>

<div class="form-group">
    <label for="date">Date</label>
    <input type="text" id="date" name="diary[date]" value="<?= $diary ? $diary->getDate() : '' ?>">
</div>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="diary[subject]" value="<?= $diary ? $diary->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="diary[content]"><?= $diary? $diary->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
