# Чек-лист внедрения профиля Яндекса

> Данные актуальны на 2026-10-09.

Внедрение сводится к копированию десятка файлов из `configs/` и `templates/` в корень проекта, одной команде установки хуков и настройке защиты ветки на хостинге. Для нового репозитория это один проход по списку ниже; для существующего - сначала инвентаризация и один форматирующий коммит, записанный в `.git-blame-ignore-revs`, затем включение проверок по одной, начиная с необязательных. Всё, что относится к GitLab, - перенос на GitLab (не Яндекс): ни один из 25 измеренных репозиториев Яндекса не использует GitLab CI. Какие правила закрывает каждый шаг, видно по ID; матрица «правило → инструмент» - в [enforcement.md](enforcement.md).

Обозначения: `конфиг → место в проекте` - что скопировать; команды даны для Linux и macOS; ID в скобках - правила, которые шаг закрывает. Перед началом прочитайте [README профиля](../README.md): там сказано, какие части - письменные правила Яндекса, какие - реконструкция, какие - «не Яндекс».

## Что копировать

| Файл профиля | Куда в проекте | Что закрывает |
|---|---|---|
| [configs/.editorconfig](../configs/.editorconfig) | `.editorconfig` | Y-REPO-012; отступы и переводы строк всех языков |
| [configs/.pre-commit-config.yaml](../configs/.pre-commit-config.yaml) | `.pre-commit-config.yaml` | хуки: форматтеры, линтеры, ноутбуки, секреты, сообщение коммита |
| [configs/python/pyproject.toml](../configs/python/pyproject.toml) | секции `[tool.*]` в `pyproject.toml` | Y-PY-001 … 047 (инструментальная часть), Y-NB-012 |
| [configs/cpp/.clang-format](../configs/cpp/.clang-format), [configs/cpp/.clang-tidy](../configs/cpp/.clang-tidy) | корень (инструменты ищут конфиг вверх по дереву) | Y-CPP-001 … 011, 017, 043 (clang-format); Y-CPP-004, 013, 020 … 024, 026 … 028, 032, 033, 040, 047, 056 … 058 (clang-tidy) |
| [configs/web/eslint.config.js](../configs/web/eslint.config.js), [configs/web/.prettierrc.json](../configs/web/.prettierrc.json), [configs/web/.stylelintrc.json](../configs/web/.stylelintrc.json) | корень (`eslint.config.js` требует `"type": "module"` в `package.json`, иначе переименуйте в `.mjs`) | Y-TS-001 … 010; Y-REACT-001, 005, 008, 009, 011 … 013; Y-CSS-006 … 008, 010, 011, 014 |
| [templates/repo/README.md](../templates/repo/README.md), [CONTRIBUTING.md](../templates/repo/CONTRIBUTING.md), [SECURITY.md](../templates/repo/SECURITY.md), [CODE_OF_CONDUCT.md](../templates/repo/CODE_OF_CONDUCT.md) | корень | Y-REPO-001, 006 … 009; Y-DOC-009 |
| [templates/github/CODEOWNERS](../templates/github/CODEOWNERS), [PULL_REQUEST_TEMPLATE.md](../templates/github/PULL_REQUEST_TEMPLATE.md), [ISSUE_TEMPLATE/](../templates/github/ISSUE_TEMPLATE/config.yml), [workflows/lint.yml](../templates/github/workflows/lint.yml) | `.github/…` | Y-REPO-013 … 016; Y-CR-003, Y-CR-011 |
| [templates/gitlab/CODEOWNERS](../templates/gitlab/CODEOWNERS), [merge_request_templates/](../templates/gitlab/merge_request_templates/Default.md), [issue_templates/](../templates/gitlab/issue_templates/Bug.md), [.gitlab-ci.yml](../templates/gitlab/.gitlab-ci.yml) | `CODEOWNERS` в корне или `.gitlab/CODEOWNERS`; шаблоны - `.gitlab/…`; `.gitlab-ci.yml` - корень | то же для GitLab (перенос - не Яндекс) |
| [templates/ml/MODEL_CARD.md](../templates/ml/MODEL_CARD.md), [DATA_CARD.md](../templates/ml/DATA_CARD.md) | рядом с моделью и набором данных | Y-MLOPS-018 … 021 |

Shell-скрипт проверки сообщения коммита лежит файлом в [configs/git/commit-msg](../configs/git/commit-msg) (его разбор и `commitlint.config.js` - текстом в [git/commits.md](git/commits.md) (разделы «Shell-хук без Node.js» и «commitlint»); файлы `release-please-config.json`, `.release-please-manifest.json` и `release.yml` - в [git/releases.md](git/releases.md).

## Новый репозиторий

Шаги идут в порядке зависимостей: сначала файлы и конфиги, потом хуки и CI, в конце - защита ветки (она требует, чтобы задания CI уже существовали и были зелёными).

### 1. Решения, которые нужно записать до первого коммита

1. Лицензия: Apache-2.0 для сервиса, SDK или продукта, MIT для npm-библиотеки или утилиты (Y-REPO-002, Y-REPO-003). Заголовки лицензии в файлы кода не добавлять (Y-REPO-004); CLA не вводить, DCO не требовать (Y-REPO-007, Y-REPO-008).
2. Модель слияния: squash (по умолчанию) или rebase; merge-коммиты выключены (Y-BR-005, Y-BR-006).
3. Схема версий: SemVer с тегами `vX.Y.Z`, первая версия `0.1.0` (Y-REL-001, Y-REL-002, Y-REL-006); для серверного продукта со стабильными ветками - [git/releases.md](git/releases.md).
4. Для C++ - три открытых пункта, которые гайды Яндекса решают по-разному: знаковые или беззнаковые целые для размеров; отступ тела `namespace` (`All` по умолчанию); регистр констант уровня namespace (`UPPER_CASE` по умолчанию) - Y-CPP-010, Y-CPP-028. Решение записать в `CONTRIBUTING.md`.
5. Для Python - имя пакета для `known-first-party` и нижняя версия `requires-python = ">=3.10"` (Y-PY-046).

### 2. Файлы репозитория (Y-REPO, Y-DOC)

1. `README.md` на английском по [шаблону](../templates/repo/README.md); русская версия - отдельным файлом со ссылкой в начале (Y-REPO-001, Y-DOC-009).
2. `LICENSE` (Y-REPO-002), `.gitignore` под стек проекта (Y-REPO-005), `CONTRIBUTING.md` по [шаблону](../templates/repo/CONTRIBUTING.md) с вариантом «без CLA» (Y-REPO-006, Y-REPO-007).
3. Для продукта с внешними пользователями - `SECURITY.md` и `CODE_OF_CONDUCT.md` по шаблонам, подставить адреса (Y-REPO-009).
4. `.editorconfig` из `configs/` (Y-REPO-012).
5. Чужой код, если он хранится в дереве, - в `contrib/` с лицензией у каждой библиотеки и исключением из линтеров (Y-REPO-010, Y-REPO-011): в `pyproject.toml` это `extend-exclude`, в CI-шаблонах - `':!contrib/**'`, в `eslint.config.js` - `ignores`.
6. Для команды - `CODEOWNERS`: GitHub ищет его в `.github/`, GitLab - в корне, `.gitlab/` или `docs/` (Y-REPO-013, Y-CR-003). Владельцев конфигов стиля и CI указать отдельной строкой (Y-CR-011); `CHANGELOG.md` и файлы версий оставить без владельца, если релизы делает бот (Y-CR-014).
7. Шаблоны PR и issue: GitHub - `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/{bug_report.yml,feature_request.yml,config.yml}`; GitLab - `.gitlab/merge_request_templates/Default.md`, `.gitlab/issue_templates/{Bug.md,Feature.md}` (Y-REPO-014, Y-REPO-015). Создать метки `bug` и `enhancement`: формы и быстрые действия на них ссылаются. В `config.yml` заменить `<CHAT_URL>` настоящим адресом.
8. Если есть документация - хранить в том же репозитории; для Diplodoc завести `.yfm`, `toc.yaml`, `presets.yaml`, `.yfmlint` и сборку на PR (Y-DOC-001 … 011).

### 3. Python (Y-PY, Y-DJ, Y-FAPI)

Файлы: секции `[tool.ruff]`, `[tool.ruff.format]`, `[tool.ruff.lint]`, `[tool.mypy]`, `[tool.pytest.ini_options]` из [configs/python/pyproject.toml](../configs/python/pyproject.toml) → `pyproject.toml`; заменить `mypkg` в `known-first-party`.

```sh
python -m pip install "ruff==0.16.8" "mypy==2.3.1" "pytest==9.1.1"
ruff format .            # Y-PY-001 … 005
ruff check --fix .       # Y-PY-006, 009, 011, 013, 014, 025, 028, 029, 036 … 038, 047
mypy src tests           # Y-PY-031, Y-PY-032 - сразу с disallow_untyped_defs
pytest                   # Y-PY-040, Y-PY-042
```

- Раскладка `src/<пакет>` и `tests/`, тесты собирает `testpaths` (Y-PY-040); в CI - матрица 3.10 … 3.14 (Y-PY-043), линтер и mypy достаточно запускать на 3.10.
- Django: раскомментировать надстройку `DJ` в конце конфига (Y-DJ-002, Y-DJ-006, Y-DJ-012, Y-DJ-013); подключить `mypy_django_plugin` (Y-DJ-015) - не Яндекс. FastAPI: надстройка `FAST` и `extend-immutable-calls` до перехода на `Annotated` (Y-FAPI-005, Y-FAPI-006, Y-FAPI-008, Y-FAPI-014) - не Яндекс.
- Код, который синхронизируется с Аркадией, форматировать вариантом B из конфига (black 120, `skip-string-normalization`), иначе `ya style` и профиль будут переформатировать один файл по-разному (кавычки).

### 4. C++ (Y-CPP)

Файлы: [configs/cpp/.clang-format](../configs/cpp/.clang-format) и [configs/cpp/.clang-tidy](../configs/cpp/.clang-tidy) → корень; в `.clang-tidy` задать `HeaderFilterRegex` под свои каталоги.

```sh
python -m pip install "clang-format==18.1.3"                      # та же версия, что в хуке и CI
git ls-files -z '*.h' '*.cpp' | xargs -0 clang-format -i --style=file   # Y-CPP-001 … 011, 017, 043
cmake -S . -B build -G Ninja -DCMAKE_CXX_STANDARD=20 -DCMAKE_EXPORT_COMPILE_COMMANDS=ON   # Y-CPP-067
run-clang-tidy-18 -p build -quiet -header-filter='.*/(src|include)/.*'                      # Y-CPP-020 … 028, 032, 033, 040, 047, 056 … 058
```

- Завести макрос проверки инвариантов и базовый класс исключений с префиксом проекта (Y-CPP-029, Y-CPP-049, Y-CPP-050); заголовки начинать с `#pragma once` (Y-CPP-035); файлы - `*.h` и `*.cpp` (Y-CPP-034).
- clang-tidy требует настроенной сборки с зависимостями: в CI-шаблонах его задание включается переменной `ENABLE_CLANG_TIDY=true` после того, как проект собирается.
- Не ждать совпадения с `ya style`: Яндекс форматирует собственной сборкой clang-format 18; стоковый форматтер расходится с ней в положении `{` после списка инициализации (Y-CPP-005) и многострочного условия (Y-CPP-002). `.clang-tidy` - реконструкция, не файл Яндекса.

### 5. Web: React, TypeScript, SCSS (Y-TS, Y-REACT, Y-CSS)

Файлы: три конфига из [configs/web/](../configs/web/eslint.config.js) → корень; в `tsconfig.json` - `"jsx": "react-jsx"` (отключён `react/react-in-jsx-scope`).

```sh
npm install --save-dev eslint@^9.38.0 @gravity-ui/eslint-config@^4.3.2 prettier@^3.5.3 \
    stylelint@^16.25.0 postcss@^8.5.6 @gravity-ui/stylelint-config@^5.0.0 typescript@^5.9.3
npm install @bem-react/classname@^1.8.0          # Y-CSS-001 … 005 (БЭМ-имена классов)
npx eslint . --max-warnings=0                     # Y-TS-002 … 010, Y-REACT-001/005/008/009/011/013
npx stylelint "src/**/*.scss"                     # Y-CSS-006 … 008, 010, 011, 014
npx prettier --check "**/*.{md,json,yaml,yml}"    # Y-TS-001, Y-REACT-012
npx tsc --noEmit                                  # Y-TS-005
```

- ESLint - мажор 9, не 10; Stylelint - 16, не 17; TypeScript < 6.1: так объявлены peer-зависимости пакетов Gravity UI 4.3.2 и 5.0.0 (диапазоны - из `package.json` gravity-ui/uikit).
- Хуки: Gravity UI использует husky + nano-staged (`"prepare": "husky"`, `npx nano-staged`, `npx commitlint -e`); в профиле те же команды подключены локальными хуками `.pre-commit-config.yaml` (перенос - не Яндекс). Для проекта на ESLint 8 - вариант `.eslintrc` с `@gravity-ui/eslint-config@^3.3.0` в [frameworks/react.md](frameworks/react.md).
- Angular: готового конфига Яндекса нет (публичных данных не найдено); альтернатива `angular-eslint` - [frameworks/angular.md](frameworks/angular.md), все правила «не Яндекс».

### 6. Дополнительные языки (Y-JAVA, Y-KT, Y-GO, Y-CS, Y-RS, Y-PHP, Y-RB)

Отдельных конфигов профиль не поставляет - только секции `.editorconfig` и команды из [languages/other.md](languages/other.md): Java - Checkstyle по `ydb.checkstyle.xml` и `mvn -B checkstyle:check`; Kotlin - `ktlint "**/*.kt" "**/*.kts"` и `./gradlew apiCheck`; Go - `.golangci.yml` формата `version: "2"` (заготовка в other.md) и `golangci-lint run ./...`; C# - `jb cleanupcode` и `jb inspectcode` или `dotnet format --verify-no-changes` (не Яндекс); Rust - `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets --no-deps -- -D warnings`, `taplo fmt --check`, `typos`; PHP - `phplint` и `composer validate --strict`; Ruby - RuboCop (не Яндекс). Закомментированные заготовки хуков для Go и Rust есть в конце `.pre-commit-config.yaml`.

### 7. Ветки, коммиты, ревью (Y-BR, Y-GIT, Y-CR)

1. Основная ветка `main` (Y-BR-001); рабочие ветки `members/<user>/<описание>` (Y-BR-004); стабильные - `stable-*` или `release/v*` (Y-BR-011).
2. Проверка сообщений: скопировать [configs/git/commit-msg](../configs/git/commit-msg) в `scripts/commit-msg` (вариант A, без Node.js) либо подключить commitlint с `commitlint.config.js` оттуда же (вариант B, как в Gravity UI). Хук стадии `commit-msg` ставится командой `pre-commit install` - ключ `default_install_hook_types` в конфиге уже включает эту стадию (Y-GIT-001 … 006, Y-GIT-013).
3. Job проверки заголовка PR/MR (`pr-title` в `lint.yml`, `mr-title` в `.gitlab-ci.yml`) добавить в обязательные проверки (Y-BR-006, Y-BR-007).
4. GitHub: «Default commit message: Pull request title»; GitLab: оставить шаблон squash-сообщения `%{title}` (Y-BR-006).
5. Записать в `CONTRIBUTING.md`: формат коммитов, имя ветки, кто одобряет и кто сливает, срок ответа ревьюера (2 рабочих дня, Y-CR-007), правило о заброшенных PR (3 месяца, Y-CR-008), требование тестов на каждое изменение (Y-CR-005).

Настройки хостинга (точные значения в репозиториях Яндекса не видны - реконструкция по документам YDB, YTsaurus, Diplodoc и uikit; названия настроек - по документации платформ на 2026-10-09):

| Настройка | GitHub | GitLab (перенос - не Яндекс) | Правило |
|---|---|---|---|
| Ветка по умолчанию | Default branch: `main` | Default branch: `main` | Y-BR-001 |
| Запрет прямого push | «Require a pull request before merging» | Protected branch: «Allowed to merge: Developers + Maintainers», «Allowed to push and merge: No one» | Y-BR-003, Y-REPO-017 |
| Линейная история | «Require linear history»; squash включён, merge commits выключены | Merge method: «Fast-forward merge»; «Squash commits when merging: Require» | Y-BR-005 |
| Обязательные проверки | «Require status checks to pass before merging» + «Require branches to be up to date»; в список - `python`, `cpp (clang-format)`, `web`, `PR Title` | «Pipelines must succeed»; merged results pipelines - Premium | Y-BR-007, Y-REPO-016 |
| Одобрения | 1 одобрение; «Require review from Code Owners» | Approval rules: 1; «Require approval from code owners», «Prevent approval by merge request creator» - Premium и Ultimate; на Free обязательных одобрений нет | Y-CR-001, Y-CR-002 |
| Обсуждения | «Require conversation resolution before merging»; auto-merge разрешён | закрытие обсуждений как условие слияния; «Set to auto-merge» | Y-CR-009 |
| Имена веток | ruleset «Restrict branch names» (зависит от тарифа) | Push rule «Branch name» - Premium | Y-BR-004 |
| Форки и свои раннеры | метка `ok-to-test`, условие на `pull_request_target` | пайплайн из форка запускает участник проекта | Y-BR-008 |
| Теги | ruleset для тегов `v*` | Protected tags `v*` | Y-REL-011 |

### 8. CI и хуки (Y-REPO-016, Y-BR-007, Y-GIT-013, Y-MLOPS-008)

1. GitHub: [templates/github/workflows/lint.yml](../templates/github/workflows/lint.yml) → `.github/workflows/lint.yml`; GitLab: [templates/gitlab/.gitlab-ci.yml](../templates/gitlab/.gitlab-ci.yml) → `.gitlab-ci.yml`. Задания пропускаются сами, если стека нет в репозитории; заменить `<PROJECT>` в шаге импорта.
2. Тесты (pytest с матрицей 3.10 … 3.14, `ctest`, `npm test`) - отдельным workflow по образцу `ci.yml` uikit и `workflow.yml` ch-tools (Y-PY-043).
3. Хуки: `pip install pre-commit && pre-commit install && pre-commit run --all-files`. Для хуков `eslint`/`stylelint`/`prettier` нужен `npm ci`; для `gitleaks` - Go (или id `gitleaks-system`).
4. Имена заданий не переименовывать после того, как они назначены обязательными проверками.

### 9. Релизы (Y-REL)

GitHub: три файла из [git/releases.md](git/releases.md) (`release-please-config.json`, `.release-please-manifest.json`, `.github/workflows/release.yml`), секрет с токеном бота или GitHub App, права `contents: write`, `issues: write`, `pull-requests: write`; первая версия в манифесте `0.1.0`, до 1.0.0 - `bump-minor-pre-major` (Y-REL-004 … 006). GitLab: release-please не работает - job `release` на пайплайне тега и ручной changelog по разделу «GitLab: перенос - не Яндекс» (Y-REL-008). Теги `v*` защитить (Y-REL-011).

### 10. ML-проект (Y-ML, Y-NB, Y-REPRO, Y-MLOPS, Y-LIB)

1. Каталоги `experiments/`, `scripts/`, `src/` (Y-ML-001); решить, какие каталоги ноутбуков рабочие (без выводов, `notebooks/`), какие демонстрационные (Y-NB-005).
2. `.gitignore`: блоки из [ml/project-structure.md](ml/project-structure.md) (дерево экспериментов, Y-ML-011) и [ml/mlops.md](ml/mlops.md) (данные, веса, логи, `.env`; Y-MLOPS-001, Y-MLOPS-005); `.gitattributes`: `*.ipynb linguist-vendored` (Y-NB-010), строки Git LFS для немногих бинарных фикстур (Y-MLOPS-004, не Яндекс).
3. `pyproject.toml` → `uv lock`; `uv.lock` и `.python-version` в git; в CI - `uv lock --check` и `uv sync --locked` (Y-REPRO-008).
4. Хуки `nbstripout` (каталоги - в `files`), `check-added-large-files --maxkb=10000`, сканер секретов (Y-NB-006, Y-NB-007, Y-MLOPS-002, Y-MLOPS-005); секреты - в хранилище CI, в коде только переменные окружения (Y-LIB-017).
5. Одна команда проверки (`just check` или `make lint`: ruff, mypy, ноутбуки) и её вызов в CI (Y-ML-008).
6. В скрипте обучения: сид из конфига (Y-REPRO-001), `report.json` рядом с конфигом (Y-ML-010, Y-REPRO-011), отказ перезаписывать готовый результат без флага (Y-REPRO-015); тест воспроизводимости с эталоном и допуском, тест схемы данных (Y-REPRO-016, Y-ML-015).
7. Обучение и инференс описать как шаги с явными входами и выходами (Y-MLOPS-006); запуск обучения на малой выборке и тесты без сети в CI (Y-MLOPS-009, Y-MLOPS-010); реестр моделей - GitLab Model Registry или сервер MLflow (Y-MLOPS-013).
8. Карточки: [MODEL_CARD.md](../templates/ml/MODEL_CARD.md) и [DATA_CARD.md](../templates/ml/DATA_CARD.md) заполнить до первой выкладки; проверка на плейсхолдеры - `grep -nE '<[A-Za-zА-Яа-яЁё]' MODEL_CARD.md` ничего не находит (Y-MLOPS-018 … 021).
9. C++-код инференса - по общему C++-профилю и с тестом паритета предсказаний (Y-MLOPS-022, Y-MLOPS-023); CatBoost - без one-hot до обучения, категориальные признаки целыми или строками (Y-LIB-001, Y-LIB-002).

## Существующий репозиторий

Принцип: историю не переписывать, правила действуют с даты внедрения; каждое механическое изменение (форматирование, очистка ноутбуков, переименования) - отдельным коммитом без функциональных правок.

### 1. Инвентаризация

```sh
for f in README.md LICENSE .gitignore CONTRIBUTING.md SECURITY.md CODE_OF_CONDUCT.md .editorconfig; do
    [ -e "$f" ] || echo "нет $f"; done                                   # Y-REPO-001 … 012
git ls-files '*.ipynb'                                                  # Y-NB-005, Y-NB-008: где ноутбуки, есть ли выводы и секреты
git ls-files -z | xargs -0 -r stat -c '%s %n' | awk '$1 > 10485760'     # Y-MLOPS-002: файлы больше 10 МБ
git ls-files | grep -E '\.(pt|pth|cbm|npz|npy|pkl|onnx)$|tfevents'      # Y-ML-011, Y-MLOPS-001: веса и логи в git
gitleaks git --redact .                                                 # Y-MLOPS-005: секреты по всей истории
grep -rn 'manual_seed\|random.seed\|np.random.seed' src scripts         # Y-REPRO-001: сиды, зашитые в код
grep -rn 'cudnn.benchmark = True' src scripts                           # Y-REPRO-005
```

Найденные секреты отозвать, а не только удалить из кода; данные и веса вынести в хранилище, для немногих оставшихся - `git lfs migrate import` (Y-MLOPS-004). Уже закоммиченные выводы ноутбуков хук не чистит - они остаются в истории.

### 2. Базовая линия: проверки сначала необязательные

1. Скопировать конфиги и CI-шаблон; первые одну-две недели задания CI не включать в обязательные проверки, чтобы увидеть объём нарушений. Проверку заголовка PR сделать обязательной после этого срока.
2. Для Python сначала включить только ядро Аркадии (`select = ["E4", "E7", "E9", "F", "W"]`) и `ruff format`; группы расширения (`I`, `UP`, `B`, `N`, `RUF`, `G`, `LOG`) добавлять по одной, каждую - отдельным коммитом с `ruff check --fix`.
3. mypy вводить постепенно, как ydb-python-sdk и ch-tools: сначала `check_untyped_defs = false` с комментарием о числе оставшихся ошибок (`# 58 errors`), затем `check_untyped_defs = true`, в конце `disallow_untyped_defs = true` (ch-tools включил его почти через два года после mypy).
4. Для C++ clang-tidy включать по каталогам (`'src/.*'` в `run-clang-tidy`): проверка имён на старом коде даёт много срабатываний; переименования - отдельными коммитами. Если код следует другому варианту (поля без `_`, PascalCase-константы, namespace без отступа), менять опции конфига, а не код: такие варианты есть у YDB, YTsaurus и YQL и описаны в Y-CPP-010, Y-CPP-026, Y-CPP-028.
5. Для ktlint и Checkstyle есть baseline-файлы существующих нарушений (Y-KT-001); для ESLint - `--max-warnings` с текущим числом, которое уменьшают.

### 3. Форматирующий коммит и `.git-blame-ignore-revs`

```sh
ruff format . && ruff check --fix --select I .                          # Python (Y-PY-001, Y-PY-011)
git ls-files -z '*.h' '*.cpp' | xargs -0 clang-format -i --style=file   # C++ (Y-CPP-068: один файл - один стиль)
npx prettier --write . && npx eslint --fix . && npx stylelint --fix "src/**/*.scss"   # web
git commit -am "style: apply profile formatters"                        # без функциональных правок
git rev-parse HEAD >> .git-blame-ignore-revs
git config blame.ignoreRevsFile .git-blame-ignore-revs                   # локально; GitHub читает файл сам
git add .git-blame-ignore-revs && git commit -m "chore: ignore formatting commit in blame"
```

Так переформатировали ydb-python-sdk (black одним коммитом в 2023 году) и userver («change code style to ya style»). Файл `.git-blame-ignore-revs` - общепринятая практика git, не Яндекс: GitHub учитывает файл с таким именем в корне репозитория в представлении blame автоматически ([документация GitHub](https://docs.github.com/en/repositories/working-with-files/using-files/viewing-and-understanding-files)), локально нужна настройка `blame.ignoreRevsFile`; коммит всё равно показывается, если он последним менял строку.

### 4. Ноутбуки и ML-артефакты

1. Разнести ноутбуки по рабочим и демонстрационным каталогам; проверить выводы на секреты и закрытые данные до включения хуков (Y-NB-005, Y-NB-008).
2. Первый прогон `nbstripout` по рабочим каталогам - отдельным коммитом: дифф будет большим (Y-NB-006).
3. `requirements.txt` без версий - закрепить версии (Y-REPRO-009) или перейти на `pyproject.toml` и `uv.lock` (Y-REPRO-008).
4. Перенести сиды из кода в конфиг (Y-REPRO-001), принять явное решение о `cudnn.benchmark` (Y-REPRO-005); удалить веса и логи из индекса и добавить шаблоны в `.gitignore` (Y-ML-011, Y-MLOPS-001). Порог размера файла проверяет только добавляемые файлы - уже закоммиченные он не трогает.
5. Заменить `yandex_cloud_ml_sdk` на `yandex_ai_studio_sdk` (Y-LIB-022); для YaFSDP закрепить коммит и сверить вызовы с кодом (Y-LIB-015); проверить код CatBoost на one-hot до обучения и float в категориальных признаках (Y-LIB-001, Y-LIB-002). Заполнить карточки для моделей, которые уже в продакшене; пройти чек-лист готовности (Y-MLOPS-012, Y-MLOPS-018).

### 5. Коммиты, ветки, релизы

1. Переименование `master` → `main` - по желанию: у 8 из 25 репозиториев Яндекса ветка по-прежнему `master` (Y-BR-001).
2. Если используются merge-коммиты - переключить способ слияния и включить «Require linear history» (Y-BR-005).
3. Существующие теги без `v` не трогать; новый формат - со следующего релиза (Y-REL-002). Для release-please записать в манифест текущую версию; при необходимости - `bootstrap-sha` в конфиге, чтобы старые коммиты не попали в первый changelog (Y-REL-004).
4. Описание условий вклада перенести в `CONTRIBUTING.md`; существующие пофайловые заголовки лицензии удалять не обязательно - массовое удаление отдельное решение правообладателя (Y-REPO-004, SHOULD).

### 6. Защита ветки

Включить после того, как CI стабильно зелёный: запрет прямого push, 1 одобрение, обязательные проверки, линейная история - по таблице настроек выше (Y-BR-003, Y-BR-007, Y-CR-001, Y-REPO-017). На GitLab Free обязательные одобрения и push rules недоступны - остаются защищённая ветка и «Pipelines must succeed».

## Проверка результата

```sh
pre-commit run --all-files                       # все хуки проходят
ruff format --check . && ruff check . && mypy src tests
git ls-files -z '*.h' '*.cpp' | xargs -0 -r clang-format --dry-run --Werror --style=file
npx eslint . --max-warnings=0 && npx stylelint "src/**/*.scss" && npx tsc --noEmit
printf 'feat(api): add retries\n' > /tmp/title.txt && sh scripts/commit-msg /tmp/title.txt   # хук принимает правильный заголовок
printf 'Исправил баг.\n' > /tmp/title.txt; sh scripts/commit-msg /tmp/title.txt || echo "ok: отклонено"   # и отклоняет неправильный
```

После этого CI на первом PR должен быть зелёным, а в настройках ветки - те же задания в списке обязательных проверок. Что из правил при этом остаётся на ревьюере, перечислено в [enforcement.md](enforcement.md#что-остаётся-на-ревью); чек-лист ревьюера - в [git/code-review.md](git/code-review.md).
