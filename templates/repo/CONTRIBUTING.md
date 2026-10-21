<!--
Шаблон CONTRIBUTING.md - профиль Яндекса (реконструкция, см. docs/git/repository.md: Y-REPO-006, Y-REPO-007).
Структура повторяет CONTRIBUTING.md проектов YDB, YTsaurus и CatBoost («Notice to external contributors»).
По умолчанию выбран вариант без CLA: вклад принимается под лицензией проекта (так у CatBoost с 2025-08-02).
Вариант с CLA оставлен в комментарии в конце файла. Замените метки в угловых скобках и удалите комментарии.
-->

# Notice to external contributors

## Common

<PROJECT> is a free and open project, and we are glad to receive contributions from the community.

## Contributing code changes

If you would like to contribute a new feature or a bug fix, please discuss your idea in a GitHub issue first.
If there is no issue for your idea, please open one: somebody may already be working on it, or there may be
obstacles worth knowing about before you start. Finding the right approach together saves time on a pull
request that cannot be merged.

Issues labelled `good first issue` are suitable for new contributors; issues labelled `help wanted` are the
ones where community help is especially welcome.

## Provide a contribution

To make a contribution, submit a pull request:

1. Fork the repository and create a branch from `<DEFAULT_BRANCH>`.
2. Make the change and add tests for the new functionality or the fixed bug.
3. Run the checks locally: `<lint command>` and `<test command>`.
4. Open a pull request, describe the change and link the related issue.
5. Wait for the checks to pass and for a review by a project team member. A pull request is merged after
   approval; if the repository has a `CODEOWNERS` file, the owners of the changed code are asked to review.

Build and test instructions: <DOCS_URL or path to BUILD.md>.

## License

By contributing to this project, you agree that your contributions will be licensed under
[the <LICENSE_NAME> license](LICENSE).

## Other questions

If you have any questions, please contact us at <CONTACT_EMAIL>.

<!--
Вариант с CLA (типовой блок есть в 11 репозиториях выборки, например в yandex/yatool и gravity-ui/uikit).
CLA Яндекса заключается с Yandex LLC и к чужому проекту неприменим: подставьте ссылку на собственное соглашение.
Если выбираете этот вариант, замените раздел «License» выше на следующий текст:

## Contributor License Agreement

To accept your contribution, we need you to agree to our Contributor License Agreement (CLA): <CLA_URL>.
When you submit your first pull request, please add the following line to its description:

    I hereby agree to the terms of the CLA available at: <CLA_URL>.

It is enough to provide this notification once.
-->
