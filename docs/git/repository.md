# Оформление репозитория и документации - профиль Яндекса

> Данные актуальны на 2026-10-09.

Общего публичного документа Яндекса об оформлении git-репозитория нет: всё ниже - реконструкция по 25 открытым репозиториям и по проектным гайдам YDB, YTsaurus, Gravity UI и Diplodoc. У всех 25 есть только `README.md` и `LICENSE`; `.gitignore` - у 24, `CONTRIBUTING.md` - у 19, остальные файлы из таблицы ниже - у 20-36 %. Заголовков лицензии в исходниках нет нигде, чужой код в производных от Аркадии проектах лежит в `contrib/` и `vendor/`. Документацию флагманские проекты ведут как код на платформе Diplodoc; у YDB опубликован гайд по её стилю. GitLab-материалов Яндекс не публикует: GitLab-варианты здесь - перенос.

См. также: [commits.md](commits.md) · [branches.md](branches.md) · [code-review.md](code-review.md) · [releases.md](releases.md) · [матрица проверок](../enforcement.md) · [чек-лист внедрения](../adoption.md).

## На чём основан документ

- **Реконструкция и выборка.** Внутри Яндекс работает в монорепозитории Аркадия с VCS Arc, а не в git ([Хабр, 2020](https://habr.com/ru/companies/yandex/articles/482926/)). Измерены 25 активных в 2026 году репозиториев из 10 организаций GitHub: дерево файлов на HEAD и 6602 коммита (до 300 на репозиторий). PR как объекты не измерялись, настройки защиты веток снаружи не видны. «7 из 25» - число репозиториев с практикой. Список и метод - в [research/yandex.md](../../research/yandex.md), раздел C.
- **Два семейства.** Зеркала Аркадии (корневой `.mapping.json` - 9 из 25) получают коммиты от роботов и не сливают PR кнопкой Merge. GitHub-first проекты (Gravity UI, Diplodoc, SDK YDB, odyssey, ch-tools, mysync; гибрид - ydb) разрабатываются через PR. Интерпретация: профиль моделирует вторые - только там практики записаны, проверяются инструментом и воспроизводимы вне Аркадии.
- **Типы источников.** «Официальный гайд» здесь - опубликованная документация проекта (YDB, Diplodoc), «производный гайд проекта» - его `CONTRIBUTING.md`, README и подобные файлы. Архивных источников нет.
- **Язык шаблонов.** README написан по-английски у всех 25, прочитанные служебные файлы и шаблоны - тоже. Поэтому шаблоны в [templates/](../../templates/) английские; по-русски - только служебный комментарий в начале файла.
- **GitLab.** Публичных данных не найдено: `.gitlab-ci.yml` и `.gitlab/` нет ни в одном из 25. Всё о GitLab - «перенос на GitLab - не Яндекс» по документации платформы.

## Файлы в корне репозитория

| Файл | Доля (из 25) | В профиле | Шаблон |
|---|---|---|---|
| `README.md` | 25 | MUST | [README.md](../../templates/repo/README.md) |
| `LICENSE` | 25 | MUST | текст берётся у автора лицензии |
| `.gitignore` | 24 | SHOULD | - |
| `CONTRIBUTING.md` | 19 | SHOULD | [CONTRIBUTING.md](../../templates/repo/CONTRIBUTING.md) |
| `CHANGELOG.md` | 9 | см. [releases.md](releases.md) | - |
| Шаблон PR или MR | 9 | SHOULD | [GitHub](../../templates/github/PULL_REQUEST_TEMPLATE.md), [GitLab](../../templates/gitlab/merge_request_templates/Default.md) |
| `SECURITY.md` | 7 | SHOULD для продукта | [SECURITY.md](../../templates/repo/SECURITY.md) |
| `CODE_OF_CONDUCT.md` | 7 | SHOULD для продукта | [CODE_OF_CONDUCT.md](../../templates/repo/CODE_OF_CONDUCT.md) |
| `CODEOWNERS` | 7 | SHOULD для команды | [GitHub](../../templates/github/CODEOWNERS), [GitLab](../../templates/gitlab/CODEOWNERS) |
| Шаблоны issue | 6 | SHOULD | [GitHub](../../templates/github/ISSUE_TEMPLATE/), [GitLab](../../templates/gitlab/issue_templates/) |
| `.editorconfig` | 5 | SHOULD | [.editorconfig](../../configs/.editorconfig) |

Остальное - по желанию: `AUTHORS` (12), файл для ИИ-агентов вроде `AGENTS.md` (9), конфиг Dependabot или Renovate (8), `.gitattributes` (5), `.pre-commit-config.yaml` (1), `NOTICE` (1), `.mailmap` (0). `SECURITY.md`, `CODE_OF_CONDUCT.md` и `CODEOWNERS` сосредоточены во флагманских продуктах (YDB, YTsaurus, userver, DataLens) и в библиотеках Gravity UI и Diplodoc. Исследовательские репозитории (`yandex-research/*`) проще: README с разделом Citation, без `CONTRIBUTING.md`, CI и тегов; публичных требований к ним не найдено.

Раскладка каталогов с исходниками в выборке не унифицирована: её задают язык и система сборки, публичных данных не найдено. Общие у репозиториев только служебные каталоги: `.github/` (workflow, шаблоны, иногда `CODEOWNERS`), а в производных от Аркадии проектах - `contrib/`, `vendor/`, `util/` и `library/` (см. [сторонний код](#сторонний-код)).

### Y-REPO-001 · MUST · В корне лежит `README.md` на английском языке
- Проверка: `test -f README.md` в CI; у Gravity UI README проверяет action `gravity-ui/readme-validator`; содержание - ручное ревью.
- Источник: [ydb · README.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/README.md) (HEAD 2026-10-09) · практика, выведенная из репозиториев (25 из 25) · высокая · реконструкция. Письменного правила нет; MUST - решение профиля: в выборке нет исключений.

### Y-REPO-002 · MUST · В корне лежит `LICENSE` с полным текстом лицензии и строкой копирайта правообладателя
- Проверка: `test -f LICENSE` в CI; распознавание лицензии - `licensee detect` (не Яндекс) или ручное ревью.
- Источник: [uikit · LICENSE](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/LICENSE) (HEAD 2026-10-07) · практика, выведенная из репозиториев (25 из 25) · высокая · реконструкция. MUST - решение профиля: исключений нет.
- Пример: в оригинале - «Copyright (c) 2021 YANDEX LLC»; в своём проекте укажите своего правообладателя.

**Лицензии (из 25):** Apache-2.0 - 16, MIT - 6, MPL-2.0 - 2, BSD-3-Clause - 1. Интерпретация: выбор связан с экосистемой - npm-пакеты выходят под MIT, серверные продукты и SDK - под Apache-2.0, производные проекты сохраняют исходную лицензию. Части под другой лицензией Perforator перечисляет в README (eBPF-программа - GPL-2.0); это единственный такой случай.

### Y-REPO-003 · SHOULD · Лицензия выбирается по типу проекта: Apache-2.0 для продуктов, сервисов и SDK, MIT для npm-библиотек и небольших утилит; производный проект сохраняет лицензию исходного
- Проверка: `licensee detect` (не Яндекс) или ручное ревью при создании репозитория.
- Источник: [ydb · LICENSE](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/LICENSE) (HEAD 2026-10-09) · практика, выведенная из репозиториев (Apache-2.0 - 16 из 25, MIT - 6, MPL-2.0 - 2, BSD-3-Clause - 1) · высокая · реконструкция.

### Y-REPO-004 · SHOULD · Заголовок лицензии или копирайта в файлы исходников не добавляется: лицензия фиксируется один раз в `LICENSE`
- Проверка: ручное ревью.
- Источник: [uikit · Button.tsx](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/src/components/Button/Button.tsx) (HEAD 2026-10-07) · практика, выведенная из репозиториев (0 из 25 с заголовками в собственном коде; по 10 случайных файлов на репозиторий) · высокая · реконструкция. У Google наоборот: заголовок обязателен в каждом файле.

### Y-REPO-005 · SHOULD · В корне есть `.gitignore`
- Проверка: `test -f .gitignore` в CI; содержимое - ручное ревью.
- Источник: [uikit · .gitignore](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.gitignore) (HEAD 2026-10-07) · практика, выведенная из репозиториев (24 из 25; нет у `yandex/yatool`) · высокая · реконструкция.

### Y-REPO-006 · SHOULD · В корне есть `CONTRIBUTING.md`: как предложить изменение, на каких условиях принимается вклад, куда писать с вопросами
- Проверка: `test -f CONTRIBUTING.md` в CI; содержание - ручное ревью.
- Источник: [ydb · CONTRIBUTING.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/CONTRIBUTING.md) (HEAD 2026-10-09) · практика, выведенная из репозиториев (19 из 25) · высокая · реконструкция. У YDB, YTsaurus и CatBoost файл устроен одинаково: «Notice to external contributors» → обсуждение идеи в issue → отправка PR → контакты.

## Условия вклада и файлы сообщества

- **CLA.** Соглашение Яндекса (редакция от 2024-10-04) заключается между Yandex LLC и контрибьютором - [yandex.ru/legal/cla](https://yandex.ru/legal/cla/?lang=en). «Подписывают» его фразой в описании первого PR: `I hereby agree to the terms of the CLA available at: [link].` CLA упоминают 13 из 25 репозиториев; бота нет, согласие проверяет человек.
- **Отказ от CLA.** Три флагмана его убрали: [YTsaurus](https://github.com/ytsaurus/ytsaurus/commit/bf5cc276acccbd22bd978079d9044f763541ffc1) и [YDB](https://github.com/ydb-platform/ydb/commit/ff661730e2e9c908769fa420502f16e0ed488072) - в 2024 году, [CatBoost](https://github.com/catboost/catboost/commit/fd18a8a9d3) - 2025-08-02; CatBoost взамен записал, что вклад лицензируется под Apache 2.0. Причины не объяснены - публичных данных не найдено.
- **DCO.** Письменного требования `Signed-off-by` нет ни в одном из 25; фактически строка стоит в большинстве коммитов у двух (odyssey, ytsaurus-k8s-operator).
- **Выбор профиля.** CLA Яндекса заключается с Yandex LLC и к чужому проекту неприменим. Профиль берёт вариант «без CLA»: вклад принимается под лицензией проекта. Вариант с CLA оставлен в шаблоне закомментированным.

### Y-REPO-007 · MUST · Условия приёма вклада записаны в `CONTRIBUTING.md`: вклад под лицензией проекта (выбор профиля) либо CLA с фразой согласия в первом PR автора
- Проверка: ручное ревью первого PR нового автора; автоматики для CLA в выборке нет.
- Источник: [catboost · CONTRIBUTING.md, License](https://github.com/catboost/catboost/blob/963da016857b/CONTRIBUTING.md) (2025-08-02) · производный гайд проекта · высокая; [yatool · CONTRIBUTING.md](https://github.com/yandex/yatool/blob/daa9a3c774de/CONTRIBUTING.md) (HEAD 2026-10-09; CLA упоминают 13 из 25) · производный гайд проекта · высокая.

### Y-REPO-008 · SHOULD · Строка `Signed-off-by` (DCO) не является условием приёма вклада
- Проверка: ручное ревью настроек: DCO-приложение на GitHub и push rule «Reject commits that aren't DCO certified» на GitLab не включаются.
- Источник: [odyssey@b3a8d45](https://github.com/yandex/odyssey/commit/b3a8d4570e805f9033d135487ecf1513a2c09f0b) (2026) · практика, выведенная из репозиториев (письменное требование - 0 из 25; строка в ≥ 50 % коммитов - 2 из 25) · средняя · реконструкция.

### Y-REPO-009 · SHOULD · У продукта с внешними пользователями есть `SECURITY.md` (куда сообщать об уязвимости, срок ответа, порядок раскрытия) и `CODE_OF_CONDUCT.md`
- Проверка: наличие файлов (страница Community Standards на GitHub); содержание - ручное ревью.
- Источник: [ydb · SECURITY.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/SECURITY.md) (HEAD 2026-10-09); [ydb-go-sdk · CODE_OF_CONDUCT.md](https://github.com/ydb-platform/ydb-go-sdk/blob/d889d79f61dd/CODE_OF_CONDUCT.md) (HEAD 2026-10-09) · практика, выведенная из репозиториев (по 7 из 25) · средняя · реконструкция.

Что в этих файлах (прочитано 2026-10-09). Все семь `SECURITY.md` написаны по одной схеме: «Reporting a Vulnerability» → «When Should I Report a Vulnerability?» → «Security Vulnerability Response» (разбор за 5 рабочих дней) → «Public Disclosure Timing» (от немедленного раскрытия до 90 дней); канал - почта, кнопка «Report a vulnerability» на GitHub (CatBoost) или Bug Bounty (userver). Шесть из семи `CODE_OF_CONDUCT.md` - одна строка с отсылкой к `CONTRIBUTING.md`; полный кодекс есть только у ydb-go-sdk - адаптация [Contributor Covenant 1.4](https://www.contributor-covenant.org/version/1/4/code-of-conduct/). Шаблон профиля даёт строку-приглашение и ссылку на Contributor Covenant без копирования текста.

## Сторонний код

Каталог чужого кода на верхнем уровне есть в 7 из 25 репозиториев: `contrib/` - 5 (ydb, ytsaurus, catboost, yatool, perforator), `vendor/` - 5, `third_party/` - 1 (userver). Раскладка унаследована от Аркадии: `contrib/` - сторонние библиотеки C, C++ и Python, `vendor/` - Go-модули; обновляет их робот отдельными коммитами.

Интерпретация: общий `contrib/` - решение для монорепозитория с одной версией библиотеки на всё дерево. В отдельном git-репозитории ту же задачу решают менеджер пакетов, lock-файл и Dependabot или Renovate (8 из 25); 18 из 25 чужой код в дерево не кладут. Правила ниже - для тех, кто кладёт.

### Y-REPO-010 · SHOULD · Чужой код в дереве лежит в отдельном каталоге верхнего уровня (`contrib/`; для Go - `vendor/`), обновляется отдельными коммитами и исключён из линтеров
- Проверка: исключение каталога в конфигах (`extend-exclude` в ruff, `DisableFormat: true` в `.clang-format` каталога, `ignores` в ESLint); остальное - ручное ревью.
- Источник: [ytsaurus · copilot-instructions.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/copilot-instructions.md) (2026-02-16) · производный гайд проекта · средняя; [yatool · docs/ru/test.md, NO_LINT](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L358) (HEAD 2026-10-09) · конфиг или инструмент · высокая. Доля: каталог есть в 7 из 25.

### Y-REPO-011 · MUST · У каждой сторонней библиотеки в дереве указана лицензия
- Проверка: в Аркадии - макрос `LICENSE(...)` в `ya.make` (сборка требует его для contrib); в git-репозитории - файл лицензии в каталоге библиотеки и ручное ревью, при желании `reuse lint` (не Яндекс).
- Источник: [yatool · build/conf/license.conf](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/conf/license.conf#L20-L30) (HEAD 2026-10-09) · конфиг или инструмент · высокая.

## Командная работа: редактор, CODEOWNERS, шаблоны, CI, защита веток

**Настройки редактора.** `.editorconfig` есть в 5 из 25 репозиториев: в четырёх JS/TS-библиотеках Gravity UI и Diplodoc и в userver. Файл профиля - [configs/.editorconfig](../../configs/.editorconfig).

### Y-REPO-012 · SHOULD · В корне есть `.editorconfig`: UTF-8, перевод строки LF, завершающий перевод строки, без хвостовых пробелов, отступ пробелами
- Проверка: `editorconfig-checker` (не Яндекс); те же свойства попутно держат Prettier, `ruff format` и clang-format.
- Источник: [uikit · .editorconfig](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.editorconfig) (HEAD 2026-10-07) · конфиг или инструмент · средняя. Доля: 5 из 25. Свойство `max_line_length` из файла Gravity UI в профиль не взято: в [спецификацию EditorConfig](https://spec.editorconfig.org/) (0.17.2) оно не входит.

**CODEOWNERS** есть в 7 из 25 репозиториев. Схем три:

- команды по каталогам: `/ydb/core/kqp/ @ydb-platform/qp`, `/*.md @ydb-platform/docs` - [ydb](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/.github/CODEOWNERS), 271 строка;
- мейнтейнеры в строке `*` и владелец на каждый компонент: `/src/components/Button @amje` - [uikit](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/CODEOWNERS);
- одна строка на весь репозиторий: `* @diplodoc-platform/team @diplodoc-bot` - [cli](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/CODEOWNERS).

Приём из [page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2/CODEOWNERS): `package.json` и `CHANGELOG.md` оставлены без владельца, чтобы релизный PR мог одобрить любой участник.

### Y-REPO-013 · SHOULD · У командного репозитория есть `CODEOWNERS`: общий владелец `*` и владельцы каталогов или компонентов
- Проверка: наличие файла; обязательность одобрения - настройка защиты ветки (Y-REPO-017).
- Источник: [uikit · contribute/pull-request.md](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/contribute/pull-request.md) (2025-08-08) · производный гайд проекта · средняя. Доля: 7 из 25.

**Шаблоны.** Шаблон PR есть у 9 из 25, шаблоны issue - у 6 (YAML-формы - uikit, cli, transform, userver; Markdown - SDK YDB); пустые issue отключены у двух (uikit, userver). В шаблоне PR YDB два раздела - «Changelog entry» и «Description for reviewers»; у Diplodoc - комментарий-памятка, «Description» и «Related issue». Шаблоны профиля собраны из этих структур.

### Y-REPO-014 · SHOULD · Есть шаблон PR или MR: описание изменения, связанный issue, способ проверки; при ручном ведении release notes - запись для changelog
- Проверка: наличие `.github/PULL_REQUEST_TEMPLATE.md` или `.gitlab/merge_request_templates/Default.md`; заполнение - ручное ревью.
- Источник: [cli · pull_request_template.md](https://github.com/diplodoc-platform/cli/blob/b020375d0344/.github/pull_request_template.md) (HEAD 2026-10-08) · практика, выведенная из репозиториев (9 из 25) · средняя · реконструкция.

### Y-REPO-015 · SHOULD · Есть шаблоны issue - сообщение об ошибке (версия, окружение, шаги, ожидаемое и фактическое поведение) и запрос функции; вопросы направлены в чат или обсуждения
- Проверка: наличие `.github/ISSUE_TEMPLATE/*.yml` и `config.yml` (в GitLab - `.gitlab/issue_templates/*.md`); заполнение - ручное ревью.
- Источник: [uikit · 1-bug-report.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/ISSUE_TEMPLATE/1-bug-report.yml) (HEAD 2026-10-07) · практика, выведенная из репозиториев (6 из 25) · средняя · реконструкция.

**CI (из 25):** GitHub Actions - 22; сборка или тесты на PR - 19; явный шаг линтера или проверки формата - 14; husky-хуки - 5; CodeQL - 4; фреймворк `pre-commit` - 1. Линтеры обычно описаны как команды `make`, `npm run` или `tox`, а CI и локальные хуки вызывают одни и те же команды. Состав проверок по языкам - в [матрице](../enforcement.md).

### Y-REPO-016 · SHOULD · CI запускается на каждый PR и на push в основную ветку: линтер с проверкой формата, проверка типов, тесты; эти задания назначены обязательными проверками
- Проверка: workflow с триггерами `pull_request` и `push` (в GitLab - пайплайн merge request); обязательность - в настройках защиты ветки.
- Источник: [uikit · ci.yml](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b/.github/workflows/ci.yml) (HEAD 2026-10-07) · практика, выведенная из репозиториев (Actions - 22 из 25, тесты на PR - 19, явный линт - 14) · высокая · реконструкция.

**Защита веток.** Настройки снаружи не видны, но проекты на них ссылаются: у YTsaurus формат имён веток «enforced by branch protection rule», у YDB PR сливается после одобрения участника команды, у uikit нужно одобрение всех вызванных владельцев кода. Число одобрений и список обязательных проверок - публичных данных не найдено. Правила процесса - в [branches.md](branches.md) и [code-review.md](code-review.md); здесь - только настройки репозитория.

### Y-REPO-017 · SHOULD · Основная и стабильные ветки защищены настройками платформы: прямой push запрещён, для слияния нужны одобрение и зелёные обязательные проверки
- Проверка: ручное ревью настроек. GitHub: «Require pull request reviews before merging», «Require review from Code Owners», «Require status checks before merging». GitLab - см. [таблицу различий](#github-и-gitlab-различия-платформ).
- Источник: [YDB · suggest-change.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/suggest-change.md) (2026-09-23) · официальный гайд · высокая; [ytsaurus · copilot-instructions.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/.github/copilot-instructions.md) (2026-02-16) · производный гайд проекта · средняя · реконструкция. Одобрение в источниках обязательно; SHOULD - потому что сами настройки публично не видны.

## Документация и README

**Diplodoc и YFM.** Флагманские проекты ведут документацию как код на платформе [Diplodoc](https://diplodoc.com/docs/en/). Проект Diplodoc (файл `.yfm`) есть в 5 из 25: ydb, ytsaurus, catboost, perforator, terraform-provider-yandex; остальные используют Sphinx, Doxygen, MkDocs, Hugo, Storybook или обычные `.md`. YFM - диалект Markdown с заявленной совместимостью с CommonMark; добавлены заметки, каты, табы, термины, переменные и включения.

```text
docs/
├── .yfm            # настройки сборки: langs, allowHtml (по умолчанию false), strict
├── .yfmlint        # log-levels: error / warn / disabled для каждого правила линтера
├── presets.yaml    # переменные; пресет default обязателен
├── redirects.yaml  # перенаправления для перенесённых страниц (так у YDB)
├── en/
│   ├── toc.yaml    # оглавление; файл вне toc.yaml в сборку не попадает
│   ├── _includes/  # переиспользуемые фрагменты
│   └── <раздел>/<статья>.md
└── ru/             # та же структура, что в en/
```

Справка Diplodoc: [структура проекта](https://diplodoc.com/docs/en/project/), [синтаксис](https://diplodoc.com/docs/en/syntax/), [настройки](https://diplodoc.com/docs/en/settings), [линтер](https://diplodoc.com/docs/en/project/lint); раскладка - [ydb/docs](https://github.com/ydb-platform/ydb/tree/d9692f89c1dd/ydb/docs). Правила линтера `MD*` взяты из markdownlint, `YFM001`-`YFM022` - собственные; YDB держит на уровне `error` около 35 правил.

**Гайд по стилю документации YDB** ([сайт](https://ydb.tech/docs/en/contributor/documentation/style-guide), изменён 2026-08-01) называет себя набором рекомендаций, а не жёстких правил. Главное вынесено в правила ниже; сверх них гайд советует расшифровывать сокращения, не писать «мы» и шутки, рисовать диаграммы в Mermaid.

Расхождения. Опубликованные страницы YDB на 2026-10-09 отставали от ветки `main` - профиль опирается на `main`. У YTsaurus текст каждой статьи лежит в `_includes/`, а английская версия готовится после русской - профиль берёт вариант YDB: он описан подробнее и проверяется линтером. Единого гайда по стилю документации для всего Яндекса - публичных данных не найдено. Двухэтапное ревью документации YDB - в [code-review.md](code-review.md).

### Y-DOC-001 · SHOULD · Документация хранится в том же репозитории, что и код, и меняется через PR
- Проверка: ручное ревью.
- Источник: [YDB · documentation/index.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/index.md) (HEAD 2026-10-09) · официальный гайд · высокая; [YTsaurus · yt/docs/README.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/yt/docs/README.md) (HEAD 2026-10-09) · производный гайд проекта · высокая. Оба проекта описывают «Documentation as Code» как свой подход, а не как требование, - отсюда SHOULD.

### Y-DOC-002 · MUST · Имена файлов и каталогов документации пишутся через дефис, а не через подчёркивание: `quick-start.md`, а не `quick_start.md`
- Проверка: ручное ревью (линтер YFM имена файлов не проверяет).
- Источник: [YDB · structure.md, General Rules](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/structure.md) (HEAD 2026-10-09) · официальный гайд · высокая; [YTsaurus · yt/docs/README.md, File Naming](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2/yt/docs/README.md) (HEAD 2026-10-09) · производный гайд проекта · высокая.

### Y-DOC-003 · MUST · Новая статья внесена в `toc.yaml` и в индексную страницу своего раздела
- Проверка: частично: `yfm build` не собирает файл, которого нет в `toc.yaml`; пункт в индексе раздела - ручное ревью по чек-листу.
- Источник: [Diplodoc · toc.yaml](https://diplodoc.com/docs/en/project/toc) (прочитано 2026-10-09) · официальный гайд · высокая; [YDB · review.md, Checklist](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/review.md) (2026-08-05) · официальный гайд · высокая.

### Y-DOC-004 · MUST · Внутренние ссылки - относительные, с расширением `.md`, без домена сайта и без параметров
- Проверка: линтер YFM, правило `YFM003` (недостижимая ссылка) на уровне `error` в [.yfmlint](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/.yfmlint).
- Источник: [YDB · style-guide.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/style-guide.md) (2026-08-01) · официальный гайд · высокая.
- Пример:
  ```markdown
  <!-- плохо -->
  См. [настройку кластера](https://example.org/docs/en/devops/setup?version=main).
  <!-- хорошо: {#T} подставит заголовок целевой статьи -->
  См. [{#T}](../devops/setup.md).
  ```

### Y-DOC-005 · SHOULD · Фрагмент, нужный в двух местах, выносится в `_includes/` и подключается включением, а не копируется
- Проверка: ручное ревью.
- Источник: [YDB · style-guide.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/style-guide.md) (2026-08-01) · официальный гайд · высокая.

### Y-DOC-006 · SHOULD · У статьи одна цель и один жанр: теория, руководство, справочник, FAQ, рецепт, release notes или подборка ссылок
- Проверка: ручное ревью по чек-листу.
- Источник: [YDB · genres.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/genres.md) (HEAD 2026-10-09) · официальный гайд · высокая.

### Y-DOC-007 · MUST · Языковые версии лежат в зеркальных каталогах (`en/`, `ru/`) с одинаковой структурой файлов; перенос или переименование статьи сопровождается записью в `redirects.yaml`
- Проверка: ручное ревью; расхождение структуры ломает переключатель языков на сайте.
- Источник: [YDB · structure.md, General Rules](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/structure.md) (HEAD 2026-10-09) · официальный гайд · высокая.

### Y-DOC-008 · SHOULD · Текст написан простым языком в активном залоге; нестандартный термин при первом упоминании ссылается на глоссарий; в русском тексте - «ё», кавычки-«ёлочки», длинное тире и заголовки без title case
- Проверка: ручное ревью.
- Источник: [YDB · Documentation style guide](https://ydb.tech/docs/en/contributor/documentation/style-guide) (2026-08-01) · официальный гайд · высокая.

**README (из 25):** английский язык - 25; раздел об установке или быстром старте - 18; бейджи - 15; упоминание лицензии - 15; раздел или ссылка о вкладе - 14. Русская версия отдельным файлом со ссылкой в начале основного README - 4 (`README.ru.md` у cli и transform, `README-ru.md` у uikit и page-constructor). Продукт (YDB, YTsaurus) пишет: описание и преимущества → системные требования → Getting Started → How to Build from Source Code → How to Contribute. Библиотека (uikit): бейджи → About → Getting Started → Usage → Development → Maintainers → Contributing → License.

### Y-DOC-009 · SHOULD · README отвечает на пять вопросов: что это, как установить или запустить, как собрать из исходников, как внести вклад, под какой лицензией
- Проверка: ручное ревью; шаблон - [templates/repo/README.md](../../templates/repo/README.md).
- Источник: [ydb · README.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/README.md) (HEAD 2026-10-09) · практика, выведенная из репозиториев (быстрый старт - 18 из 25, лицензия - 15, вклад - 14) · средняя · реконструкция.

**Автоматическая проверка.** YDB собирает документацию на каждом PR и публикует превью; сборка идёт по событию `pull_request` с токеном только на чтение. Среди правил линтера на уровне `error` - `MD033` (HTML в тексте) и `YFM003` (недостижимая ссылка).

### Y-DOC-010 · SHOULD · Документация собирается и проверяется линтером в CI на каждом PR
- Проверка: задание CI со сборкой `yfm build` и `.yfmlint` с правилами на уровне `error`; у YDB - `diplodoc-platform/docs-build-action@v3` с превью в комментарии к PR.
- Источник: [ydb · docs_build.yaml](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/.github/workflows/docs_build.yaml) (HEAD 2026-10-09) · конфиг или инструмент · высокая. Доля: `.yfmlint` - 2 из 25 (ydb, ytsaurus).

### Y-DOC-011 · SHOULD · HTML в Markdown-тексте документации не используется
- Проверка: `.yfmlint`: `MD033: error` (так у YDB); в Diplodoc HTML по умолчанию экранируется (`allowHtml: false`).
- Источник: [YDB · style-guide.md, Things to avoid](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd/ydb/docs/en/core/contributor/documentation/style-guide.md) (2026-08-01) · официальный гайд · высокая. Гайд допускает HTML как обход отсутствующих стилей.

## GitHub и GitLab: различия платформ

Всё о GitLab - «перенос на GitLab - не Яндекс»; факты проверены по документации платформ 2026-10-09.

| Тема | GitHub | GitLab |
|---|---|---|
| Где лежит `CODEOWNERS` | `.github/`, корень, `docs/` - берётся первый найденный ([документация](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)) | корень, `docs/`, `.gitlab/` - берётся первый найденный ([документация](https://docs.gitlab.com/user/project/codeowners/)) |
| Синтаксис `CODEOWNERS` | плоский список; побеждает последний совпавший шаблон; строка без владельцев снимает владение | то же внутри секции плюс секции `[Имя]`, необязательные `^[Имя]`, число одобрений `[Имя][2]`, владельцы по умолчанию в заголовке секции, исключения `!путь` ([справочник](https://docs.gitlab.com/user/project/codeowners/reference/)) |
| Обязательное одобрение | «Require pull request reviews before merging» с числом одобрений и «Require review from Code Owners» ([документация](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)) | «Require approval from code owners» в защищённой ветке и [approval rules](https://docs.gitlab.com/user/project/merge_requests/approvals/rules/) - только Premium и Ultimate; на Free одобрение остаётся договорённостью |
| Шаблон PR или MR | `pull_request_template.md` в `.github/`, корне или `docs/` ([документация](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)) | `.gitlab/merge_request_templates/*.md`; `Default.md` подставляется сам; работают быстрые действия (`/label`, `/assign`) ([документация](https://docs.gitlab.com/user/project/description_templates/)) |
| Шаблоны issue | YAML-формы в `.github/ISSUE_TEMPLATE/` с обязательными полями ([синтаксис](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)); `config.yml` с `blank_issues_enabled` и `contact_links` ([документация](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)) | `.gitlab/issue_templates/*.md` - только Markdown: обязательность полей теряется, метки ставятся через `/label` |

Ещё два отличия GitLab. Запрет прямого push выставляется явно: «Allowed to push and merge: No one» в [защищённой ветке](https://docs.gitlab.com/user/project/repository/branches/protected/). Пайплайн MR включается условием `$CI_PIPELINE_SOURCE == "merge_request_event"`; для MR из форка он идёт в форке, а в родительском проекте его запускает участник кнопкой «Run pipeline» ([документация](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/)) - метка `ok-to-test`, как у ydb и ytsaurus, не нужна. Методы слияния и серверные проверки сообщений - в [branches.md](branches.md) и [commits.md](commits.md).

## Чего в профиле нет

- Число обязательных одобрений и состав обязательных проверок в настройках репозиториев: публичных данных не найдено.
- Шаблона «нового репозитория Яндекса» не существует: сайт [opensource.yandex](https://opensource.yandex/) перечисляет проекты, но правил оформления не содержит.
- Артефакты экспорта из Аркадии (`.mapping.json`, трейлер `commit_hash:`) в обычном репозитории не нужны.
