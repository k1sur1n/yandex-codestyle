<!--
Шаблон описания merge request - перенос на GitLab - не Яндекс.
Яндекс не публикует GitLab-шаблонов; это перенос шаблона templates/github/PULL_REQUEST_TEMPLATE.md
(профиль Яндекса, реконструкция, см. docs/git/repository.md: Y-REPO-014).
Положите файл в .gitlab/merge_request_templates/Default.md в ветке по умолчанию:
файл с именем Default.md GitLab подставляет в новый merge request автоматически.
Отличия от GitHub: каталог шаблонов другой; в шаблоне работают быстрые действия (строки, начинающиеся с «/»)
и переменные вида %{source_branch} (только в шаблоне по умолчанию).
-->

<!--
Before submitting:
1. Give the merge request a title in the Conventional Commits format, e.g. `fix(parser): handle empty input`.
2. Include tests for any bug fix or new feature.
3. Update the documentation if the change affects it.
4. Make sure the branch is up to date with `%{target_branch}`.
-->

## Description

<!-- What changes and why. Attach a screenshot or a log if it helps the reviewer. -->

Related issue: #<!-- issue number; write "Closes #123" to close it on merge -->

## How to test

<!-- Commands or steps a reviewer can use to check the change. -->

## Changelog entry

<!-- A short user-readable description for the release notes.
     Remove this section if release notes are generated from commit messages or the change is not user-visible. -->

<!-- Быстрые действия выполняются при сохранении, если у автора есть права. Пример: -->
/assign me
