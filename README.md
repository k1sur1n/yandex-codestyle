# yandex-codestyle

> Данные актуальны на 2026-10-09.

Это профиль публичного стандарта кода Яндекса для обычного git-репозитория на GitHub или GitLab: 437 правил, у каждого есть способ проверки и источник, плюс 9 готовых конфигов и 17 шаблонов файлов репозитория и CI. Профиль собрал владелец репозитория только по публичным источникам: гайдам, конфигам, документации, открытым репозиториям, статьям и докладам сотрудников. Парный репозиторий [k1sur1n/google-codestyle](https://github.com/k1sur1n/google-codestyle/tree/main) устроен так же и описывает профиль Google; сравнение двух профилей в [comparison/](comparison/README.md) опубликовано в обоих репозиториях одним и тем же текстом, различаются только ссылки.

## Быстрый старт

Пути ниже относятся к этому репозиторию, команды выполняются в корне вашего проекта.

1. Скопируйте конфиги в корень проекта: `configs/.editorconfig` и `configs/.pre-commit-config.yaml`; для Python секции `[tool.*]` из `configs/python/pyproject.toml` в свой `pyproject.toml` (замените `mypkg`); для C++ `configs/cpp/.clang-format` и `configs/cpp/.clang-tidy` (задайте `HeaderFilterRegex`); для веба три файла из `configs/web/`.
2. Скопируйте шаблоны: `templates/repo/*` в корень, `templates/github/*` в `.github/`; для GitLab вместо этого `templates/gitlab/*` в `.gitlab/`, а `.gitlab-ci.yml` в корень. Для ML-проекта `templates/ml/*` кладутся рядом с моделью и данными. Замените метки `<…>` и удалите комментарии-шапки.
3. Скопируйте `configs/git/commit-msg` в `scripts/commit-msg` проекта и поставьте хуки:

   ```sh
   pip install pre-commit && pre-commit install && pre-commit run --all-files
   ```

   `pre-commit install` ставит и стадию `commit-msg`: ключ `default_install_hook_types` уже есть в конфиге.
4. Отформатируйте код одним коммитом без функциональных правок и спрячьте его из blame:

   ```sh
   ruff format . && ruff check --fix --select I .
   git ls-files -z '*.h' '*.cpp' | xargs -0 clang-format -i --style=file
   npx prettier --write . && npx eslint --fix . && npx stylelint --fix "src/**/*.scss"
   git commit -am "style: apply profile formatters"
   git rev-parse HEAD >> .git-blame-ignore-revs
   ```

5. Включите CI: `templates/github/workflows/lint.yml` в `.github/workflows/` или `templates/gitlab/.gitlab-ci.yml` в корень. Когда прогон зелёный, настройте защиту ветки по таблице в [docs/adoption.md](docs/adoption.md#7-ветки-коммиты-ревью-y-br-y-git-y-cr).
6. На ревью ссылайтесь на правила по ID, например `Y-CPP-021`. Что остаётся на ревьюере после всех инструментов, перечислено в [docs/enforcement.md](docs/enforcement.md#что-остаётся-на-ревью).

Полный чек-лист, отдельно для нового и для существующего репозитория, лежит в [docs/adoption.md](docs/adoption.md). В шапке каждого конфига указана версия инструмента и то, запускался ли файл локально.

## Что внутри

- `docs/`: 437 правил в 26 областях, 17 документов по языкам, фреймворкам, git и ML; плюс матрица проверок [enforcement.md](docs/enforcement.md) и чек-лист внедрения [adoption.md](docs/adoption.md).
- `configs/`: 9 файлов для копирования в проект: `.editorconfig`, `.pre-commit-config.yaml`, `pyproject.toml`, `.clang-format`, `.clang-tidy`, хук `commit-msg`, конфиги ESLint, Prettier и Stylelint.
- `templates/`: 17 файлов: README, CONTRIBUTING, SECURITY и CODE_OF_CONDUCT, шаблоны PR и issue, CODEOWNERS и CI для GitHub и для GitLab, карточки модели и данных.
- `research/`: отчёт [yandex.md](research/yandex.md) о том, откуда взят каждый факт, и [open-issues.md](research/open-issues.md) с замечаниями и открытыми вопросами (общий для обоих репозиториев).
- `comparison/`: 8 документов о различиях с Google, тот же текст лежит в google-codestyle.
- [NOTICE.md](NOTICE.md): заимствованные фрагменты и скопированные конфиги с лицензиями.

<details><summary>Полное дерево файлов</summary>

```text
yandex-codestyle/
├── README.md
├── NOTICE.md
├── docs/
│   ├── languages/
│   │   ├── python.md                Python
│   │   ├── cpp.md                   C++
│   │   └── other.md                 TS/JS, Java, Kotlin, Go, C#, Rust, PHP, Ruby
│   ├── frameworks/
│   │   ├── react.md                 React вместе с CSS/SCSS и БЭМ
│   │   ├── angular.md               Angular (не Яндекс)
│   │   ├── django.md                Django
│   │   └── fastapi.md               FastAPI
│   ├── git/
│   │   ├── repository.md            обязательные файлы, лицензии, CLA, документация, GitHub и GitLab
│   │   ├── commits.md               сообщения коммитов
│   │   ├── branches.md              ветки и процесс PR/MR
│   │   ├── code-review.md           код-ревью
│   │   └── releases.md              версии, теги, релизы, changelog
│   ├── ml/
│   │   ├── project-structure.md     структура ML-проекта, конфиги экспериментов, типизация тензоров
│   │   ├── notebooks.md             ноутбуки в репозитории
│   │   ├── reproducibility.md       сиды, детерминизм, окружение, трекинг
│   │   ├── mlops.md                 данные и веса, пайплайны, CI/CD, реестр, мониторинг, карточки, C++ в ML
│   │   └── libraries.md             CatBoost, YaFSDP, AI Studio SDK, PyTorch, scikit-learn, Hugging Face
│   ├── enforcement.md               матрица «правило → инструмент / ручное ревью»
│   └── adoption.md                  чек-лист внедрения
├── configs/
│   ├── .editorconfig
│   ├── .pre-commit-config.yaml
│   ├── python/
│   │   └── pyproject.toml           секции [tool.ruff], [tool.mypy], [tool.pytest]; варианты B и C
│   ├── cpp/
│   │   ├── .clang-format            дословный дефолт Аркадии
│   │   └── .clang-tidy              реконструкция
│   ├── git/
│   │   └── commit-msg               shell-хук проверки сообщения коммита
│   └── web/
│       ├── eslint.config.js
│       ├── .prettierrc.json
│       └── .stylelintrc.json
├── templates/
│   ├── repo/
│   │   ├── README.md
│   │   ├── CONTRIBUTING.md
│   │   ├── SECURITY.md
│   │   └── CODE_OF_CONDUCT.md
│   ├── github/
│   │   ├── PULL_REQUEST_TEMPLATE.md
│   │   ├── ISSUE_TEMPLATE/
│   │   │   ├── bug_report.yml
│   │   │   ├── feature_request.yml
│   │   │   └── config.yml
│   │   ├── CODEOWNERS
│   │   └── workflows/
│   │       └── lint.yml
│   ├── gitlab/                      перенос на GitLab (не Яндекс)
│   │   ├── merge_request_templates/
│   │   │   └── Default.md
│   │   ├── issue_templates/
│   │   │   ├── Bug.md
│   │   │   └── Feature.md
│   │   ├── CODEOWNERS
│   │   └── .gitlab-ci.yml
│   └── ml/
│       ├── MODEL_CARD.md
│       └── DATA_CARD.md
├── research/
│   ├── yandex.md                    полный отчёт: разделы A-F брифа
│   └── open-issues.md               замечания и открытые вопросы (общий для обоих репозиториев)
└── comparison/                      тот же текст лежит в google-codestyle
    ├── README.md                    главные отличия, сводная таблица, навигация
    ├── approach.md                  философия, история, создание правил, контроль соблюдения, монорепозиторий
    ├── code.md                      Python, C++, фронтенд, Django и FastAPI, дополнительные языки
    ├── examples.md                  «один код, два стиля»: шесть пар примеров
    ├── repository.md                git, ревью и open source
    ├── ml.md                        MLE и MLOps
    ├── choosing.md                  что взять у каждой команды для своего стека
    └── glossary.md                  внутренние термины обеих компаний
```

</details>

Области и число правил в каждой:

| Область | Правил | Документ |
|---|---|---|
| Python (`PY`) | 47 | [docs/languages/python.md](docs/languages/python.md) |
| C++ (`CPP`) | 68 | [docs/languages/cpp.md](docs/languages/cpp.md) |
| TypeScript / JavaScript (`TS`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| Java (`JAVA`) | 8 | [docs/languages/other.md](docs/languages/other.md) |
| Kotlin (`KT`) | 7 | [docs/languages/other.md](docs/languages/other.md) |
| Go (`GO`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| C# (`CS`) | 7 | [docs/languages/other.md](docs/languages/other.md) |
| Rust (`RS`) | 10 | [docs/languages/other.md](docs/languages/other.md) |
| PHP (`PHP`) | 5 | [docs/languages/other.md](docs/languages/other.md) |
| Ruby (`RB`) | 5 | [docs/languages/other.md](docs/languages/other.md) |
| React (`REACT`) | 21 | [docs/frameworks/react.md](docs/frameworks/react.md) |
| CSS / БЭМ (`CSS`) | 14 | [docs/frameworks/react.md](docs/frameworks/react.md) |
| Angular (`NG`) | 15 | [docs/frameworks/angular.md](docs/frameworks/angular.md) |
| Django (`DJ`) | 15 | [docs/frameworks/django.md](docs/frameworks/django.md) |
| FastAPI (`FAPI`) | 14 | [docs/frameworks/fastapi.md](docs/frameworks/fastapi.md) |
| Репозиторий (`REPO`) | 17 | [docs/git/repository.md](docs/git/repository.md) |
| Документация (`DOC`) | 11 | [docs/git/repository.md](docs/git/repository.md) |
| Коммиты (`GIT`) | 13 | [docs/git/commits.md](docs/git/commits.md) |
| Ветки и PR (`BR`) | 12 | [docs/git/branches.md](docs/git/branches.md) |
| Код-ревью (`CR`) | 15 | [docs/git/code-review.md](docs/git/code-review.md) |
| Релизы (`REL`) | 13 | [docs/git/releases.md](docs/git/releases.md) |
| Структура ML-проекта (`ML`) | 18 | [docs/ml/project-structure.md](docs/ml/project-structure.md) |
| Ноутбуки (`NB`) | 14 | [docs/ml/notebooks.md](docs/ml/notebooks.md) |
| Воспроизводимость (`REPRO`) | 16 | [docs/ml/reproducibility.md](docs/ml/reproducibility.md) |
| MLOps (`MLOPS`) | 23 | [docs/ml/mlops.md](docs/ml/mlops.md) |
| ML-библиотеки (`LIB`) | 29 | [docs/ml/libraries.md](docs/ml/libraries.md) |
| **Итого** | **437** | |

## Как читать правило

Все правила записаны одинаково. Вот одно из [docs/languages/python.md](docs/languages/python.md) без изменений:

```markdown
### Y-PY-004 · SHOULD · Строковые литералы пишутся в двойных кавычках
- Проверка: `ruff format` (`quote-style = "double"`).
- Источник: [YTsaurus Python Style Guide, Quotes](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L32-L34) (2025-07-30) · производный гайд проекта · средняя: [дефолт Аркадии](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/py_style/pyproject.toml#L3) кавычки не нормализует, а 3 из 17 репозиториев (testsuite, tabm, tabred) задают одинарные.
```

`Y-PY-004` это ID: `Y` значит Яндекс, `PY` область, `004` порядковый номер в документе. ID постоянны: номер не переиспользуют и не сдвигают при правках, новое правило получает следующий номер в конце области, поэтому на правило можно ссылаться из ревью, из `comparison/` и из других репозиториев. `MUST` стоит там, где формулировка источника обязательна или проект-источник проверяет правило форматтером или CI; `SHOULD` это рекомендация или правило, восстановленное по практике большинства.

Строка «Проверка» называет инструмент и код правила линтера, либо «ручное ревью», либо «частично: …», если инструмент закрывает только часть правила. Строка «Источник» даёт ссылку на раздел источника, дату или версию, тип источника и уверенность (`высокая`, `средняя`, `низкая`): насколько источник подтверждает правило в той форме, в какой оно записано. Три пометки в конце строки предупреждают о слабых местах. «· реконструкция» значит, что правило выведено из практики открытых репозиториев, и в нём указаны выборка и доля, например «11 из 17». «· не Яндекс» значит, что публичных данных Яндекса не нашлось и взят внешний источник. «· архив» значит, что источник заархивирован; действующие правила на таких источниках не строятся. Если правило неочевидно, за строкой «Источник» идёт пример «плохо / хорошо». Объяснения причин в документах помечены словом «Интерпретация» и отделены от фактов; там, где искали и не нашли, написано «публичных данных не найдено».

Какой документ и какие конфиги нужны для вашего стека:

| Язык или фреймворк | Документ | Конфиги и шаблоны | Инструменты | Откуда правила |
|---|---|---|---|---|
| Python | [docs/languages/python.md](docs/languages/python.md), `Y-PY-001…047` | [configs/python/pyproject.toml](configs/python/pyproject.toml) | ruff 0.16.8, mypy 2.3.1, pytest 9.1.1; вариант B: black 26.5.1 | ядро: дефолт Аркадии (yatool) и гайд YTsaurus; остальное: реконструкция по 17 репозиториям |
| C++ | [docs/languages/cpp.md](docs/languages/cpp.md), `Y-CPP-001…068` | [configs/cpp/.clang-format](configs/cpp/.clang-format), [configs/cpp/.clang-tidy](configs/cpp/.clang-tidy) | clang-format ≥ 16 (проверено 18.1.3), clang-tidy ≥ 17 (проверено 18.1.3), C++20 | `.clang-format`: дословный дефолт Аркадии; гайд CatBoost; `.clang-tidy`: реконструкция |
| TypeScript / JavaScript (Node.js) | [docs/languages/other.md](docs/languages/other.md), `Y-TS-001…010` | [configs/web/eslint.config.js](configs/web/eslint.config.js), [configs/web/.prettierrc.json](configs/web/.prettierrc.json) | ESLint 9.x, `@gravity-ui/eslint-config` 4.3.2, Prettier 3.x, TypeScript 5.9 | конфиги Gravity UI (15 из 16 репозиториев) |
| React, CSS/SCSS, БЭМ | [docs/frameworks/react.md](docs/frameworks/react.md), `Y-REACT-001…021`, `Y-CSS-001…014` | те же плюс [configs/web/.stylelintrc.json](configs/web/.stylelintrc.json) | Stylelint 16.x, `@gravity-ui/stylelint-config` 5.0.0, `@bem-react/classname` | конфиги и `contribute/` Gravity UI; методология БЭМ; `mapsapi-codestyle` только как архив |
| Angular | [docs/frameworks/angular.md](docs/frameworks/angular.md), `Y-NG-001…015` | конфига нет; фрагмент `angular-eslint` в документе | angular-eslint 22.5.0 | все правила не Яндекс (Angular Style Guide) |
| Django | [docs/frameworks/django.md](docs/frameworks/django.md), `Y-DJ-001…015` | надстройка `DJ` в комментарии [pyproject.toml](configs/python/pyproject.toml) | ruff `DJ`, django-stubs 6.1.2 | 3 правила по django-ydb-backend, 12 не Яндекс |
| FastAPI | [docs/frameworks/fastapi.md](docs/frameworks/fastapi.md), `Y-FAPI-001…014` | надстройка `FAST` в комментарии [pyproject.toml](configs/python/pyproject.toml) | ruff `FAST`, FastAPI 0.143 | все правила не Яндекс |
| Java | [docs/languages/other.md](docs/languages/other.md), `Y-JAVA-001…008` | секция в [.editorconfig](configs/.editorconfig); конфиг Checkstyle не копируется (ссылка на `ydb.checkstyle.xml`) | Checkstyle через maven-checkstyle-plugin 3.6.0 | конфиги ydb-java-sdk |
| Kotlin | [docs/languages/other.md](docs/languages/other.md), `Y-KT-001…007` | секция в `.editorconfig` (`ktlint_code_style = intellij_idea`) | ktlint 1.8.0 (не Яндекс), binary-compatibility-validator 0.13.2, detekt | Yatagan, DivKit, документация yatool |
| Go | [docs/languages/other.md](docs/languages/other.md), `Y-GO-001…010` | секция в `.editorconfig`; заготовка `.golangci.yml` в документе; хук в комментарии `.pre-commit-config.yaml` | golangci-lint v2.13.1 | конфиг ydb-go-sdk |
| C# | [docs/languages/other.md](docs/languages/other.md), `Y-CS-001…007` | секция в `.editorconfig` | ReSharper GlobalTools 2025.3.2; альтернатива `dotnet format` | ydb-dotnet-sdk, catboost/dotnet |
| Rust | [docs/languages/other.md](docs/languages/other.md), `Y-RS-001…010` | секция в `.editorconfig`; фрагмент `Cargo.toml` в документе; хук `typos` в комментарии | rustfmt, clippy (Rust 1.88+), taplo 0.10.0, typos 1.48.0 | ydb-rs-sdk |
| PHP | [docs/languages/other.md](docs/languages/other.md), `Y-PHP-001…005` | секция в `.editorconfig` | phplint 3.x, composer; PER-CS не Яндекс | ydb-php-sdk |
| Ruby | [docs/languages/other.md](docs/languages/other.md), `Y-RB-001…005` | секция в `.editorconfig` | RuboCop 1.91 | все правила не Яндекс |
| Scala, Elixir | [docs/languages/other.md](docs/languages/other.md), раздел об отборе | нет | нет | исключены с обоснованием (опросы 2025-2026, нет кода Яндекса) |

Области вне языков:

| Область | Документ | Конфиги и шаблоны |
|---|---|---|
| Репозиторий и документация | [docs/git/repository.md](docs/git/repository.md), `Y-REPO-001…017`, `Y-DOC-001…011` | [configs/.editorconfig](configs/.editorconfig); [templates/repo/](templates/repo/README.md); `CODEOWNERS`, шаблоны PR/MR и issue в [templates/github/](templates/github/CODEOWNERS) и [templates/gitlab/](templates/gitlab/CODEOWNERS) |
| Коммиты | [docs/git/commits.md](docs/git/commits.md), `Y-GIT-001…013` | хук `commit-msg` в [configs/.pre-commit-config.yaml](configs/.pre-commit-config.yaml); job `pr-title`/`mr-title` в CI-шаблонах; скрипт и `commitlint.config.js` в документе |
| Ветки и PR | [docs/git/branches.md](docs/git/branches.md), `Y-BR-001…012` | таблица настроек защиты ветки в [docs/adoption.md](docs/adoption.md) |
| Код-ревью | [docs/git/code-review.md](docs/git/code-review.md), `Y-CR-001…015` | `CODEOWNERS`, шаблон PR/MR |
| Релизы | [docs/git/releases.md](docs/git/releases.md), `Y-REL-001…013` | release-please (три файла в документе); job `release` для GitLab |
| Структура ML-проекта | [docs/ml/project-structure.md](docs/ml/project-structure.md), `Y-ML-001…018` | блок `.gitignore` в документе |
| Ноутбуки | [docs/ml/notebooks.md](docs/ml/notebooks.md), `Y-NB-001…014` | хуки `nbstripout`, `check-added-large-files`, `ruff` для `.ipynb` в `.pre-commit-config.yaml`; job `notebooks` в CI |
| Воспроизводимость | [docs/ml/reproducibility.md](docs/ml/reproducibility.md), `Y-REPRO-001…016` | `uv lock --check` в CI (команда в документе) |
| MLOps | [docs/ml/mlops.md](docs/ml/mlops.md), `Y-MLOPS-001…023` | хук `gitleaks`, блок `.gitignore` в документе; [templates/ml/MODEL_CARD.md](templates/ml/MODEL_CARD.md), [templates/ml/DATA_CARD.md](templates/ml/DATA_CARD.md); job `secrets` в CI |
| ML-библиотеки | [docs/ml/libraries.md](docs/ml/libraries.md), `Y-LIB-001…029` | таблица «библиотека \| рекомендации \| антипаттерны \| источник \| уверенность» в документе |

## Откуда правила и насколько им верить

Единого публичного «Yandex Code Style» не существует. Поэтому правила лежат в трёх слоях, и слой каждого правила виден по строке «Источник».

Первый слой: письменные правила и конфиги Яндекса. Это `CPP_STYLE_GUIDE.md` и дополнения команды CatBoost, гайды `yt/styleguide/{cpp,python}.md` YTsaurus, дефолтные `.clang-format`, `ruff.toml` и `config.yaml` clang-tidy Аркадии из `yandex/yatool`, пакеты `@gravity-ui/{eslint,prettier,stylelint}-config`, `contribute/` и `AGENTS.md` uikit, гайд по документации YDB, документация CatBoost, DataSphere и AI Studio SDK. Отсюда взяты почти весь C++ (форматирование и большая часть именования), ядро Python-конфига, веб-конфиги, Diplodoc/YFM и правила о CatBoost и YaFSDP. Таких правил 240, пометок у них нет.

Второй слой: реконструкция. Где письменного правила нет, профиль измерил 25 открытых репозиториев (организации yandex, gravity-ui, ydb-platform, userver-framework, ytsaurus, catboost, yandex-cloud, diplodoc-platform, yandex-research) и 12 исследовательских репозиториев `yandex-research` и записал практику большинства как правило уровня `SHOULD` с выборкой и долей, например «19 из 25». Так получено почти всё о git (репозиторий: 12 из 17 правил; коммиты, ветки, ревью, релизы), Python-профиль как целое (11 из 47), `.clang-tidy`, структура ML-проекта (15 из 18), воспроизводимость (15 из 16) и MLOps (12 из 23). Таких правил 120.

Третий слой: общепринятая альтернатива не от Яндекса. Публичных данных нет совсем для Angular (15 из 15), FastAPI (14 из 14) и Ruby (5 из 5), почти нет для Django (12 из 15); частично их нет для ноутбуков (5 из 14), MLOps (11 из 23), библиотек PyTorch, scikit-learn и Hugging Face (7 из 29) и для коммитов и релизов (Conventional Commits, release-please). Источники в этом слое: PEP 8, гайд Angular, документация Django, FastAPI, PyTorch, Cookiecutter Data Science, Conventional Commits, DVC и другие. Таких правил 92, у них пометка «· не Яндекс». 15 правил несут обе пометки, поэтому сумма слоёв больше 437.

| Слой | Пометка в строке «Источник» | Правил |
|---|---|---|
| Письменные правила и конфиги Яндекса | нет | 240 |
| Реконструкция по 25 открытым репозиториям | `· реконструкция` | 120 |
| Общепринятая альтернатива | `· не Яндекс` | 92 |

Из 437 правил 156 уровня `MUST` и 281 уровня `SHOULD`; инструмент проверяет целиком 183 правила, частично 74, остальные 180 остаются на ревью. Счётчики получены скриптом из строк «Источник» и «Проверка» документов (сводка сборки от 2026-10-09) и совпадают с [docs/enforcement.md](docs/enforcement.md).

Где источники Яндекса расходятся, профиль выбрал один вариант и описал остальные как альтернативы (подробности и отвергнутые варианты в документах). C++: аркадийный вариант с префиксами `T`/`I`/`E`/`N`, суффиксом `_` у полей и дословным `.clang-format` Аркадии; стили userver и YTsaurus даны как альтернативы. Python: 120 символов, двойные кавычки, `ruff` + `mypy`, база 3.10; вариант «буквальный дефолт Аркадии» есть в конфиге. Веб: конфиги Gravity UI; `yandex/mapsapi-codestyle` в архиве с 2023-08-03 и используется только как история. Коммиты: Conventional Commits на английском, как у Gravity UI и Diplodoc. Ветки: trunk-based, squash, `main`.

## Чего здесь нет

- Часть инструментов не запускалась. Реестры npm и PyPI из среды сборки были недоступны, поэтому фреймворк pre-commit, commitlint, Stylelint, nbstripout, jupytext, плагины ESLint (в том числе `@gravity-ui/eslint-config`), release-please и DVC не исполнялись; их конфиги сверены с исходниками на закреплённых версиях. Локально проверены clang-format и clang-tidy 18.1.3, ruff 0.16.8, black 26.5.1, mypy 2.3.1, Prettier без плагинов, Python 3.13. Шапка каждого конфига говорит, запускался ли он.
- Практика git измерена по выборке, а не по организации: 25 репозиториев Яндекса, 6 602 коммита (из них 5 114 сделаны людьми), по 300 последних коммитов на репозиторий. Pull request как объекты не измерялись (API GitHub был недоступен); настройки защиты веток видны только там, где лежат в репозитории как код. Долю вроде «6 из 25» нужно читать как свойство выборки.
- О внутренних практиках (Аркадия, Arc, Arcanum, `ya make`, NeuroReview) известно только из статей и докладов сотрудников и из файлов, экспортированных вместе с открытым кодом. Общий C++-гайд Аркадии и регламент комитетов недоступны; публичного аналога readability не найдено.
- Источники меняются. Всё датировано 2026-10-09: гайд CatBoost получил 18 правок за июль, август и сентябрь 2026 года, `yandex/mapsapi-codestyle` в архиве с 2023-08-03. Ссылки на файлы репозиториев закреплены на коммитах, ссылки на сайты нет.
- Для Angular, FastAPI, Ruby, большей части Django и части MLOps публичных источников Яндекса нет: это 92 правила с пометкой «не Яндекс». GitLab-варианты шаблонов и CI тоже перенос: ни один из 25 репозиториев не использует GitLab, и Яндекс не публикует материалов для GitLab.
- Сравнение в `comparison/` опирается и на источники Google. Их ограничения (книга «Software Engineering at Google» под CC BY-NC-ND 4.0 только пересказана, цифры статьи CACM 2016 и опроса ICSE-SEIP 2018 взяты из вторичных источников) описаны в [README google-codestyle](https://github.com/k1sur1n/google-codestyle/blob/main/README.md) и в [google-codestyle/research/google.md](https://github.com/k1sur1n/google-codestyle/blob/main/research/google.md#метод-и-ограничения).
- 11 вопросов остаются за вами: обязательность английского языка в коммитах, нижняя версия Python для Django и ML-кода, `max_line_length` в `.editorconfig` и другие. Они собраны в [research/open-issues.md](research/open-issues.md) вместе с тем, что было исправлено при проверке и что оставлено как есть.

Полный перечень того, что проверить не удалось, лежит в разделах [«Метод и ограничения»](research/yandex.md#метод-и-ограничения) и [«Чего в публичном доступе нет»](research/yandex.md#чего-в-публичном-доступе-нет) отчёта.

## Лицензии

Текст этого репозитория (правила, отчёт, сравнение, список замечаний, шаблоны и комментарии в конфигах) написан своими словами и принадлежит владельцу репозитория. Файла `LICENSE` здесь нет намеренно: выберите лицензию для собственного текста сами и положите её в корень. Парный репозиторий лицензируется отдельно.

Заимствованные фрагменты и скопированные конфиги перечислены в [NOTICE.md](NOTICE.md) с источником, лицензией и местом использования. Дословно скопированы `configs/cpp/.clang-format` (дефолтный файл Аркадии, Apache-2.0) и опции `@gravity-ui/prettier-config` (MIT); хук `configs/git/commit-msg` написан по образцу `.husky/commit-msg` Diplodoc (MIT). Основные лицензии источников: репозитории Яндекса Apache-2.0 (yatool, YDB, YTsaurus, CatBoost, userver) и MIT (Gravity UI, Diplodoc), документация Yandex Cloud CC BY 4.0, гайд Angular CC BY 4.0. Лицензии CC-BY требуют указания авторства: строки атрибуции приведены в NOTICE, при переносе фрагментов в свой проект их нужно сохранить. Где лицензия источника не установлена, в NOTICE и в карте источников стоит «лицензия не проверена». Источники Google, на которые опирается `comparison/`, перечислены в [NOTICE парного репозитория](https://github.com/k1sur1n/google-codestyle/blob/main/NOTICE.md).

## Как обновлять

1. Сверьте карту источников ([раздел A отчёта](research/yandex.md#a-карта-источников)) с текущим состоянием: у каждого источника указаны статус, дата последнего содержательного изменения и, для файлов репозиториев, коммит. Изменения Яндекса видны по файлам `yandex/yatool`, CatBoost, YTsaurus, YDB и по релизам пакетов Gravity UI.
2. Правила не перенумеровывайте. Изменившееся правило правьте под тем же ID, устаревшее помечайте в тексте, а не удаляйте, новое добавляйте в конец области со следующим номером. Так ссылки из ревью, из `comparison/` в обоих репозиториях и из чужих репозиториев остаются верными.
3. После правок обновите дату актуальности в шапке изменённых документов, счётчики в этом README и в `docs/enforcement.md` (их считает скрипт по строкам правил) и версии инструментов в шапках конфигов. Если конфиг перепроверен локально, поправьте строку «Проверено локально».
4. Новый заимствованный фрагмент или скопированный конфиг: новая строка в [NOTICE.md](NOTICE.md).
5. `comparison/*.md` и `research/open-issues.md` одинаковы в обоих репозиториях. Правку в них вносите в обе копии, меняя только ссылки.

## Связанные материалы

- [research/yandex.md](research/yandex.md): полный отчёт, карта источников, измерение 25 репозиториев, внутренние практики (Аркадия, Arc, Arcanum, `ya make`), происхождение и конфликты правил, ML.
- [research/open-issues.md](research/open-issues.md): что требует вашего решения, что исправлено, что оставлено и почему.
- [comparison/README.md](comparison/README.md): чем отличаются подходы двух компаний и почему; дальше по разделу: [approach.md](comparison/approach.md), [code.md](comparison/code.md), [examples.md](comparison/examples.md), [repository.md](comparison/repository.md), [ml.md](comparison/ml.md), [choosing.md](comparison/choosing.md), [glossary.md](comparison/glossary.md).
- [docs/enforcement.md](docs/enforcement.md): какое правило проверяет инструмент, какое ревьюер.
- [docs/adoption.md](docs/adoption.md): чек-лист внедрения для нового и существующего репозитория, GitHub и GitLab.
- [NOTICE.md](NOTICE.md): заимствованные фрагменты, скопированные конфиги, лицензии.
- [k1sur1n/google-codestyle](https://github.com/k1sur1n/google-codestyle/blob/main/README.md): парный профиль Google (правила `G-…`) и отчёт [research/google.md](https://github.com/k1sur1n/google-codestyle/blob/main/research/google.md).
