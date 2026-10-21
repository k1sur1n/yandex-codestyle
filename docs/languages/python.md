# Python - профиль Яндекса

> Данные актуальны на 2026-10-09.

Единого публичного Python-гайда у Яндекса нет. Есть один письменный гайд команды (YTsaurus, 76 строк, 2025-07-30), дефолтные конфиги линтеров Аркадии в открытом `yandex/yatool` и разнородные конфиги отдельных проектов. Профиль - реконструкция: длина строки 120, двойные кавычки, порядок импортов PEP 8, `ruff` как форматтер и линтер, `mypy` с обязательными аннотациями, `pytest`, база Python 3.10. Из 47 правил 23 проверяет инструмент, 4 - частично, 20 остаются на ручное ревью. Готовый конфиг - [`../../configs/python/pyproject.toml`](../../configs/python/pyproject.toml).

## Как читать этот документ

Правила имеют постоянные идентификаторы `Y-PY-001` … `Y-PY-047`. `MUST` стоит там, где источник формулирует правило как обязательное или где его проверяет дефолтный инструмент Аркадии; `SHOULD` - у рекомендаций и у правил, выведенных из практики большинства репозиториев. Если уровень профиля отличается от уровня источника, причина указана в строке «Источник».

Источники правил и их вес:

| Источник | Что это | Статус | Как используется |
|---|---|---|---|
| [YTsaurus Python Style Guide](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md) | единственный письменный Python-гайд команды Яндекса; действует в `yt/python`, `yt/cron`, `yt/odin`, `yt/yt/tests/integration` | активен, опубликован 2025-07-30, Apache-2.0 | текст правил; там, где он расходится с остальными, показаны оба варианта |
| Дефолтные конфиги Аркадии в `yandex/yatool`: [black](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/py_style/pyproject.toml), [ruff](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml), [flake8](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/flake8/flake8.conf) | настройки, с которыми `ya make` и `ya style` проверяют Python-код монорепозитория | активны, Apache-2.0 | ядро профиля; это дефолт инструментов, а не гайд |
| Документация yatool: [`ya style`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md), [`ya test`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md) | описание форматтеров, линтеров и тестов системы сборки | активна | правила про форматтер, pytest, подавления |
| Правила проекта в [`AGENTS.md` ydb-python-sdk](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md) | короткий список «Key Rules», написанный для ИИ-агентов, но фиксирующий требования команды | активен | правила про язык, версию Python, тесты, совместимость |
| Конфиги 17 открытых Python-репозиториев (выборка S17) | `pyproject.toml`, `tox.ini`, `.pre-commit-config.yaml`, workflow CI | 16 активны, yandex-tank не обновляется с 2025-03-12 | правила «практика, выведенная из репозиториев» с долей |

Выборка S17: ydb-python-sdk, yandex-ai-studio-sdk, yandex-cloud/python-sdk, yandex-taxi-testsuite, ch-tools, datalens-backend, ydb-sqlalchemy, django-ydb-backend, ydb-mcp, langchain-ydb, ytsaurus-airflow-provider, YaFSDP, tabm, tabred, pgmigrate, yandex-tank, catboost/python-package. Python-код монорепозиториев (`ydb/tests`, `yt/python`, `devtools/ya` в yatool) в выборку не входит и учитывается отдельно как «код из Аркадии».

Публичного гайда «Python в Аркадии» и правил внутреннего Python Committee - публичных данных не найдено.

## Инструменты открытых Python-проектов Яндекса

Это ответ на вопрос «какие форматтеры, линтеры и проверку типов используют YDB, YTsaurus, CatBoost и AI Studio SDK». Версии и опции скопированы из файлов репозиториев на 2026-10-09.

| Проект | Форматтер | Линтер | Импорты | Типы | Тесты | Python | Длина строки, кавычки |
|---|---|---|---|---|---|---|---|
| **Дефолт Аркадии** ([yatool](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/py_style/default_configs.json)) | black: `line-length = 120`, `skip-string-normalization = true`; включается макросом `STYLE_PYTHON()`. `ruff format` - опция `ya style --ruff` и `STYLE_RUFF(CHECK_FORMAT)` | flake8 автоматически для всех `PY_SRCS` и `TEST_SRCS`: `select = E, W, F, C9, N8, PL`, `max-line-length = 200`; ruff по макросу `STYLE_RUFF()`: `select = ["E4", "E7", "E9", "F", "W"]` | не проверяются | в открытых конфигах не настроены | pytest (`PY3TEST()` + `TEST_SRCS()`), автоматический импорт-тест | версии инструментов не раскрыты | 120 в форматтере, 200 в линтере; кавычки не нормализуются |
| **YDB**: [ydb-python-sdk](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/tox.ini) | black==25.11.0, `line-length = 120`; в CI | flake8==6.1.0 через pytest-flake8: `max-line-length = 160`, `ignore=E203,E704,W503`; в CI. pylint настроен, в CI не входит | - | mypy>=1.0.0: `no_implicit_optional`, `disallow_untyped_decorators`, `strict_equality`; `check_untyped_defs = false`; в CI | pytest>=7.0.0,<8.0.0, pytest-asyncio==0.21.0, `asyncio_mode = auto` | `>=3.10`; CI 3.10-3.14 | 120 (black) / 160 (flake8); двойные |
| **YDB**: Python в монорепозитории [ydb](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/ci/gh-runner-controller/pyproject.toml#L1-L6) | дефолт Аркадии; для утилит `ydb/ci/*` - black `line-length=120` | дефолтный flake8 Аркадии | isort `profile = "black"` (утилиты CI) | нет | `PY3TEST()`, pytest | - | 120 |
| **YTsaurus**: [yt/python](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md) | форматтер не подключён (макросов `STYLE_*` в `yt/python/yt/wrapper/ya.make` нет); есть письменный гайд | дефолтный flake8 Аркадии (вывод из системы сборки); публичный CI на GitHub Python не линтует | вручную, «от частного к общему» | нет | pytest, `--strict-markers` | `>=3.8` | 100 по гайду (фактически 4,2 % строк длиннее 100); двойные |
| **CatBoost**: [python-package](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/python-package/pyproject.toml) | конфигов нет | конфигов нет (в Аркадии - дефолтный flake8) | - | нет | pytest (`python_files = test*.py`) | не объявлена | не задана (2,4 % строк длиннее 120, максимум 193) |
| **AI Studio SDK**: [yandex-ai-studio-sdk](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/pyproject.toml#L101-L123) | `[tool.black] line-length = 120` задан, но black не запускается ни в pre-commit, ни в tox | pytest-flakes, pytest-pylint (только на 3.12); pre-commit: pyupgrade v3.21.0 `--py310-plus`, codespell v2.1.0, pygrep-hooks v1.9.0 | isort 5.13.2, `line_length = 120`; хук добавляет `from __future__ import annotations` | mypy<1.20 через pytest-mypy | pytest<9, `--doctest-modules`, `--block-network` | `>=3.10`; CI 3.10-3.14 | 120; одинарные де-факто (74 %) |
| [yandex-cloud/python-sdk](https://github.com/yandex-cloud/python-sdk/blob/187f99b2aff37457861d1c0faf45c0810c9f8dc3/pyproject.toml#L90-L124) | black>=24.10.0, `line-length = 120`; в CI | flake8>=7.1.1 (`max-complexity = 15`), pylint>=3.3.2; в CI | isort>=5.13.2, `profile = "black"` | mypy>=1.13.0: `disallow_untyped_defs`, `check_untyped_defs`, `warn_unreachable`; в CI | pytest>=8.3.4 | `>=3.9`; CI 3.9-3.13 | 120; двойные |
| [yandex-taxi-testsuite](https://github.com/yandex/yandex-taxi-testsuite/blob/85b1c33fc1e788f217ddc51c5d16a2736b3061af/pyproject.toml#L1-L15) | `ruff format`: `line-length = 80`, `quote-style = 'single'`; в CI | ruff: `select = ['E9', 'F63', 'F7', 'F82', 'F401']` | ruff `I` | mypy>=1.11.0,<1.16; в CI | pytest, `--strict-markers`, `asyncio_mode = auto` | `>=3.10`; CI 3.10-3.14 | 80; одинарные |
| [ch-tools](https://github.com/yandex/ch-tools/blob/e2bda7b65af39aef7d0f55a8d00ef0956bce7f93/pyproject.toml#L128-L146) | black >= 25.1 (88 по умолчанию); в CI | ruff: `select = ["E", "F", "W", "A"]`, без `E501`; pylint; codespell | isort >= 6.0, `profile = "black"` | mypy >= 1.17: `disallow_untyped_defs`, `check_untyped_defs`; в CI | pytest (юнит), behave (интеграционные) | `>=3.10`; CI 3.10-3.14 | 88; двойные |
| [datalens-backend](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/pyproject.toml#L12-L147) | black==26.5.1: `line-length = 120`; в CI | ruff==0.15.13 (только линтер): `ASYNC`, `B`, `C4`, `DTZ`, `F`, `G`, `LOG`, `N`, `PERF`, `PIE`, `PT`, `RET`, `RUF`, `S`, `SIM`, `UP` и часть `ANN`; без `E501` | isort==5.13.2, `profile = "black"` | mypy==2.1.0: `disallow_untyped_defs`, `check_untyped_defs`, `warn_unused_ignores`; в CI | pytest==7.2.2 | `>=3.12, <3.13` | 120; двойные |
| [YaFSDP](https://github.com/yandex/YaFSDP/blob/6896a680b08c1e45ec64c60c943f348bad1322fd/pyproject.toml#L29-L72) | `ruff format --check` | ruff: `B`, `C4`, `D`, `FURB`, `G`, `I`, `LOG`, `N`, `PERF`, `PL`, `RSE`, `RUF`, `TC`, `TID`, `UP`, `W`; `pydocstyle convention = "google"` | ruff `I` | mypy `strict = true` | pytest | `>=3.12` | 88; двойные |

Доли по S17:

- **Линтер:** ruff - 11 из 17; flake8 или pyflakes - 5 из 17; pylint - 5 из 17; нет линтера - 1 из 17 (catboost).
- **Форматтер:** black в CI - 5 из 17; `ruff format` - 6 из 17 (в CI - 2); yapf - 2 из 17; не применяется - 4 из 17.
- **Проверка типов:** mypy - 11 из 17; только конфиг pyright - 1 из 17; нет - 5 из 17.
- **Длина строки:** 120 - 6 из 17 (плюс дефолт Аркадии); 88 - 5 из 17; 79-80 - 3 из 17; 121, 200 и «не задана» - по одному.
- **Нижняя версия Python:** ≥3.10 - 7 из 17; ≥3.9 - 3 из 17; ≥3.12 - 4 из 17; остальные не объявляют.

### Какой вариант берёт профиль

| Вариант | Состав | Когда выбирать |
|---|---|---|
| **A - профиль** | `ruff format` + `ruff check` (ядро Аркадии `E4, E7, E9, F, W` плюс `I, UP, B, N, RUF, G, LOG`), 120 символов, двойные кавычки, mypy с `disallow_untyped_defs`, pytest | новый git-репозиторий |
| B - буквальный дефолт Аркадии | black 120 со `skip-string-normalization`, ruff `E4, E7, E9, F, W`; без сортировки импортов и без проверки типов | код, который синхронизируется с Аркадией и должен проходить её проверки без изменений |
| C - гайд YTsaurus | 100 символов, двойные кавычки, импорты «свои → сторонние → стандартные», синтаксис 3.8+ | вклад в каталоги YTsaurus, где действует гайд |

Профиль берёт вариант A. Причины:

1. **120 символов** стоят в обоих дефолтных конфигах Аркадии и у 6 из 17 репозиториев, включая SDK YDB, Yandex Cloud и AI Studio; 100 действует только в каталогах YTsaurus, 200 - страховочный предел линтера, а не целевой стиль.
2. **ruff вместо black + flake8 + isort.** Инструменты Аркадии поддерживают ruff с 2024-01-24 (макрос `STYLE_RUFF`, опция `ya style --ruff`), 11 из 17 репозиториев уже используют ruff, а новые репозитории 2025-2026 годов (django-ydb-backend, ydb-mcp, langchain-ydb, ytsaurus-airflow-provider) стартуют сразу на нём. Формат `ruff format` с теми же параметрами совместим с black.
3. **Двойные кавычки**: так сказано в единственном письменном правиле, и так по умолчанию работают black и ruff. Режим Аркадии «не трогать кавычки» нужен монорепозиторию со старым кодом, а не новому проекту.
4. **mypy** настроен в 11 из 17 репозиториев; pyright - только в двух исследовательских.

Варианты B и C лежат в том же [`pyproject.toml`](../../configs/python/pyproject.toml) закомментированными блоками.

## 1. Форматирование

Форматирование в профиле решается инструментом. Главные расхождения источников - длина строки и кавычки; оба варианта показаны в строке «Источник». Гайд YTsaurus называет своей базой PEP 8 («PEP 8 with a slight YT C++ flavour»), поэтому всё, чего нет в правилах ниже, берётся из [PEP 8](https://peps.python.org/pep-0008/).

### Y-PY-001 · MUST · Код форматирует инструмент - `ruff format`; раскладку кода на ревью не обсуждают
- Проверка: `ruff format --check .` в CI и pre-commit (вариант B - `black --check .`).
- Источник: [yatool, документация `ya style`, раздел Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md#L32-L35) (2024-08-05) · конфиг или инструмент · высокая; [yandex-taxi-testsuite, pyproject.toml](https://github.com/yandex/yandex-taxi-testsuite/blob/85b1c33fc1e788f217ddc51c5d16a2736b3061af/pyproject.toml#L1-L15) (2026-10-01) · практика, выведенная из репозиториев (форматтер настроен в 13 из 17, в CI проверяется в 7 из 17) · высокая. В Аркадии форматтер включает сам проект (макрос `STYLE_PYTHON()` или `STYLE_RUFF(CHECK_FORMAT)`), а дефолтный форматтер там - black; профиль ставит MUST и берёт `ruff format`, потому что на форматтере держатся Y-PY-002 … Y-PY-006.

### Y-PY-002 · MUST · Длина строки - не больше 120 символов
- Проверка: `ruff format` (`line-length = 120`); `ruff E501` выключен - длину держит форматтер, как в ch-tools и datalens-backend.
- Источник: [yatool, py_style/pyproject.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/py_style/pyproject.toml#L2) (2023-11-29) и [ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L1) (2024-01-24) · конфиг или инструмент · высокая как дефолт Аркадии, средняя как общий стандарт: [гайд YTsaurus](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L37-L39) требует 100.

### Y-PY-003 · MUST · Отступ - 4 пробела; табуляция запрещена
- Проверка: `ruff format` (`indent-style = "space"`); `ruff W191`.
- Источник: [YTsaurus Python Style Guide, General](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L16) (2025-07-30; отсылка к PEP 8) · производный гайд проекта · высокая; [yatool, ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L4) (группа `W`) · конфиг или инструмент · высокая.

### Y-PY-004 · SHOULD · Строковые литералы пишутся в двойных кавычках
- Проверка: `ruff format` (`quote-style = "double"`).
- Источник: [YTsaurus Python Style Guide, Quotes](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L32-L34) (2025-07-30) · производный гайд проекта · средняя: [дефолт Аркадии](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/py_style/pyproject.toml#L3) кавычки не нормализует, а 3 из 17 репозиториев (testsuite, tabm, tabred) задают одинарные.

### Y-PY-005 · SHOULD · В многострочном вызове, сигнатуре или литерале каждый элемент стоит на своей строке с висячей запятой, а закрывающая скобка - на отдельной строке под началом конструкции
- Проверка: `ruff format` (висячая запятая закрепляет разбиение по строкам); `ruff COM812` вместе с форматтером не включают - в django-ydb-backend он отключён с пометкой о конфликте.
- Источник: [YTsaurus Python Style Guide, Indents](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L42-L65) (2025-07-30; в гайде - «may») · производный гайд проекта · высокая.
- Пример:

```python
# плохо
result = build_request(path=source_table_path,
                       columns=["key", "value"])

# хорошо
result = build_request(
    path=source_table_path,
    columns=["key", "value"],
)
```

### Y-PY-006 · MUST · В конце строк нет пробелов; файл заканчивается ровно одним переводом строки
- Проверка: `ruff W291`, `W292`, `W293` (`W391` - лишние пустые строки в конце файла - в ruff 0.16.8 preview-правило и без `--preview` не работает; их убирает `ruff format`); pre-commit `trailing-whitespace`, `end-of-file-fixer`.
- Источник: [yatool, ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L4) (группа `W`, 2024-01-24) · конфиг или инструмент · высокая; [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L6-L19) (2026-08-30) · конфиг или инструмент · высокая.

### Y-PY-007 · SHOULD · Фрагмент, который форматтер не должен трогать, ограждают парой `# fmt: off` / `# fmt: on`
- Проверка: ручное ревью.
- Источник: [yatool, документация `ya style`, раздел Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md#L33) (2024-08-05) · конфиг или инструмент · высокая.

### Y-PY-008 · MUST · Сгенерированный и сторонний код (protobuf-стабы, каталоги `generated/`, `contrib/`, `vendor/`) не форматируют и не линтуют
- Проверка: `extend-exclude` в `[tool.ruff]`, `exclude` в `[tool.mypy]`; в Аркадии - правила пропуска `ya style` и макрос `NO_LINT()`.
- Источник: [yatool, rules.py](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/library/python/testing/style/rules.py#L23-L34) (HEAD 2026-10-09) · конфиг или инструмент · высокая; [ydb-python-sdk, tox.ini](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/tox.ini#L88-L94) (2026-10-07) · конфиг или инструмент · высокая.

В Аркадии отдельный файл исключают из стилизации маркером `# DO_NOT_STYLE` в тексте файла ([rules.py](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/library/python/testing/style/rules.py#L23-L50)); вне Аркадии этот маркер ничего не делает - используйте `extend-exclude`.

## 2. Именование

Python-код Яндекса следует PEP 8 без собственных надстроек: по статистике выборки функций не в `snake_case` - не более 1 % в каждом репозитории (исключение - переопределения методов компилятора SQLAlchemy вида `visit_VARCHAR` в ydb-sqlalchemy), классов не в `PascalCase` - от 0 до 4 на репозиторий. Правил об именах пакетов и каталогов сверх PEP 8 - публичных данных не найдено.

### Y-PY-009 · MUST · Имена следуют PEP 8: `snake_case` - функции, методы, переменные и модули; `PascalCase` - классы; `UPPER_CASE` - константы
- Проверка: `ruff N801`-`N818`, `N999` (группа `N`; в flake8 Аркадии - группа `N8`).
- Источник: [yatool, flake8.conf](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/flake8/flake8.conf#L3-L13) (набор `select` неизменен с 2023-11-29) · конфиг или инструмент · высокая; [yandex-ai-studio-sdk, pyproject.toml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/pyproject.toml#L170-L196) (стили имён pylint, 2026-08-30) · конфиг или инструмент · высокая.

### Y-PY-010 · SHOULD · Префиксы типов из C++-кода Яндекса (`T`, `I`, `E`, `N`) в Python не переносят
- Проверка: ручное ревью.
- Источник: [ytsaurus, yt/python/yt/wrapper/errors.py](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/python/yt/wrapper/errors.py) (HEAD 2026-10-09) · практика, выведенная из репозиториев (префиксов нет ни в одном из 17 и ни в одной кодовой базе из Аркадии) · высокая · реконструкция.
- Пример: о префиксах в C++ - [cpp.md](cpp.md):

```python
# плохо - калька с C++
class TRetryPolicy: ...
class IStorage: ...
class EErrorCode(enum.Enum): ...

# хорошо
class RetryPolicy: ...
class Storage: ...
class ErrorCode(enum.Enum): ...
```

## 3. Структура файлов и модулей, импорты

Публичных правил Яндекса о раскладке пакета (`src/` или пакет в корне), об именах каталогов и о выборе между `dataclasses`, `attrs` и `pydantic` - публичных данных не найдено. В выборке встречаются оба варианта раскладки: `src/` у yandex-ai-studio-sdk, пакет в корне у ydb-python-sdk и yandex-cloud/python-sdk.

Порядок импортов - главный конфликт источников. Гайд YTsaurus [предписывает](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L24-L29) порядок «от частного к общему»: сначала библиотеки yt, затем сторонние, затем стандартные - так же, как принято упорядочивать `#include` в C++-коде Яндекса. Остальные репозитории используют порядок PEP 8. Профиль берёт порядок PEP 8: его применяют 13 из 17 репозиториев, и его проверяет стандартное правило `I001`. Настройка под гайд YTsaurus - вариант C в конфиге.

### Y-PY-011 · SHOULD · Импорты сортирует инструмент в порядке: стандартная библиотека → сторонние пакеты → свои пакеты
- Проверка: `ruff I001` (свои пакеты перечислены в `[tool.ruff.lint.isort] known-first-party`).
- Источник: [yandex-cloud/python-sdk, pyproject.toml](https://github.com/yandex-cloud/python-sdk/blob/187f99b2aff37457861d1c0faf45c0810c9f8dc3/pyproject.toml#L93-L94) (2026-10-05) · практика, выведенная из репозиториев (13 из 17) · высокая; обратный порядок - [YTsaurus Python Style Guide, Imports](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L24-L29) (2025-07-30) · производный гайд проекта · высокая.
- Пример:

```python
# профиль (PEP 8, isort)
import logging
from collections.abc import Iterable

import grpc

from mypkg.errors import ClientError

# гайд YTsaurus - только в каталогах YTsaurus
from .common import flatten

import yt.logger as logger

import requests

import copy
```

### Y-PY-012 · SHOULD · Между пакетами используют абсолютные импорты; относительные допустимы только внутри одного пакета
- Проверка: ручное ревью; по желанию `ruff TID252` (запрещает относительные импорты из родительских пакетов).
- Источник: [datalens-backend, lib/dl_core](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/lib/dl_core) (2026-09-30) · практика, выведенная из репозиториев (доля по выборке не измерялась: в dl_core 1955 абсолютных `from`-импортов против 6 относительных, в `ydb/` и yt wrapper внутри пакета преобладают относительные) · низкая · реконструкция.

### Y-PY-013 · MUST · `from module import *` не используют
- Проверка: `ruff F403`, `F405`.
- Источник: [yatool, ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L4) (группа `F`, 2024-01-24) · конфиг или инструмент · высокая.

### Y-PY-014 · MUST · Неиспользуемых импортов нет; единственное исключение - реэкспорт в `__init__.py`
- Проверка: `ruff F401`; исключение задаётся в `per-file-ignores` для `__init__.py`.
- Источник: [yatool, документация `ya test`, линтеры Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L354-L358) (2026-10-06) · конфиг или инструмент · высокая; [ch-tools, pyproject.toml](https://github.com/yandex/ch-tools/blob/e2bda7b65af39aef7d0f55a8d00ef0956bce7f93/pyproject.toml#L145-L146) (2026-10-08) · конфиг или инструмент · высокая.

### Y-PY-015 · SHOULD · `from __future__ import annotations` в новый код не добавляют: при базе 3.10 синтаксис `X | None` и `list[int]` работает без него
- Проверка: ручное ревью (обратное решение проверяет `ruff I002` с опцией `required-imports`).
- Источник: [datalens-backend, pyproject.toml](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/pyproject.toml#L119-L121) (импорт запрещён внутренними правилами, 2026-09-30); [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L21-L25) (импорт добавляется хуком, 2026-08-30) · конфиг или инструмент · низкая · реконструкция. Общего правила нет: два проекта решили противоположно; профиль выбирает вариант без дополнительного импорта.

### Y-PY-016 · SHOULD · Каждый модуль пакета импортируется на чистом окружении без ошибок
- Проверка: частично: сбор тестов pytest и mypy находят часть ошибок импорта; надёжнее отдельный шаг CI `python -c "import <пакет>"`. В Аркадии для программ и тестов автоматически выполняется `import_test`.
- Источник: [yatool, документация `ya test`, тестирование для Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L90-L126) (2026-10-06) · конфиг или инструмент · высокая для Аркадии, средняя для git-репозитория · реконструкция (перенос практики Аркадии в git-репозиторий - наш).

Следующие три правила взяты из списка «Key Rules» одного проекта - SDK YDB. Они показывают, чего команда требует от библиотеки с внешними пользователями; для прикладного сервиса их применяют по смыслу.

### Y-PY-017 · SHOULD · Публичный API библиотеки не ломают - его только расширяют
- Проверка: ручное ревью.
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L65-L73) (2026-10-07) · производный гайд проекта · высокая для SDK YDB, низкая как общее правило. В источнике запрет безусловный; профиль ставит SHOULD, потому что правило сформулировано одним проектом и для библиотеки.

### Y-PY-018 · SHOULD · Если библиотека даёт синхронный и асинхронный API, их меняют одним изменением и держат зеркальными
- Проверка: ручное ревью.
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L65-L73) (2026-10-07; в SDK это пары `ydb/` и `ydb/aio/`) · производный гайд проекта · высокая для SDK YDB, низкая как общее правило. В источнике - «must»; уровень понижен по той же причине, что в Y-PY-017.

### Y-PY-019 · SHOULD · Новую внешнюю зависимость добавляют только при явной необходимости
- Проверка: ручное ревью (изменения списка `dependencies`).
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L65-L73) (2026-10-07) · производный гайд проекта · высокая для SDK YDB; [ydb, ydb/agents/GUIDE.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/GUIDE.md#L24-L27) (в монорепозитории пакеты берутся из `contrib/python`) · производный гайд проекта · средняя.

## 4. Комментарии и docstring

Единого формата docstring у Яндекса нет: SDK YDB, YTsaurus, Yandex Cloud и AI Studio пишут reST-поля, YaFSDP и tabm - формат Google (в YaFSDP он задан конфигом `pydocstyle convention = "google"`), CatBoost - формат NumPy. Проверку наличия docstring отключили все проекты выборки, где есть pylint или группа `D` в ruff; datalens-backend прямо пишет в конфиге, что docstring по всему репозиторию не требуются. Профиль берёт reST-поля как формат большинства SDK и не проверяет наличие docstring автоматически.

### Y-PY-020 · SHOULD · Публичные функции, методы и классы кратко описаны в docstring
- Проверка: ручное ревью (`ruff D1xx` и pylint `missing-*-docstring` отключены во всех проектах выборки, где эти линтеры есть).
- Источник: [YTsaurus Python Style Guide, Docstring](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L75) (2025-07-30) · производный гайд проекта · высокая как текст правила; соблюдается слабо - в `yt/python/yt/wrapper` 73 % публичных функций без docstring.

### Y-PY-021 · SHOULD · Параметры и результат в docstring описывают reST-полями `:param name:` и `:return:`
- Проверка: ручное ревью.
- Источник: [ytsaurus, cypress_commands.py](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/python/yt/wrapper/cypress_commands.py#L61-L75) (HEAD 2026-10-09); [ydb-python-sdk, ydb/query/pool.py](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/ydb/query/pool.py) (2026-10-07) · практика, выведенная из репозиториев (4 SDK: ydb, yt, yandexcloud, ai-studio; формат Google - в 2 репозиториях, NumPy - в CatBoost) · средняя · реконструкция.
- Пример:

```python
def read_rows(path: str, limit: int | None = None) -> list[dict[str, object]]:
    """Read rows from a table.

    :param path: path to the table.
    :param limit: maximum number of rows; ``None`` means no limit.
    :return: rows as dictionaries keyed by column name.
    """
```

### Y-PY-022 · SHOULD · Идентификаторы, комментарии и docstring пишут на английском
- Проверка: ручное ревью (`ruff RUF001`-`RUF003` ловят только символы-двойники и в конфиге профиля выключены).
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L72) (2026-10-07) · производный гайд проекта · высокая для SDK YDB, низкая как общее правило. В источнике правило обязательное; профиль ставит SHOULD, потому что [datalens-backend](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/pyproject.toml#L122-L146) сознательно допускает кириллицу в строках и комментариях.

### Y-PY-023 · SHOULD · Очевидный код не комментируют; комментарий объясняет неочевидное решение
- Проверка: ручное ревью.
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L71) (2026-10-07); [ydb, ydb/tools/mnc/AGENTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/tools/mnc/AGENTS.md) (HEAD 2026-10-09) · производный гайд проекта · средняя.

### Y-PY-024 · SHOULD · Метки в комментариях пишут с логином автора: `# TODO(login): …`, `# COMPAT(login): …`, `# XXX(login): …`
- Проверка: ручное ревью; по желанию `ruff TD002` (TODO без автора).
- Источник: [ytsaurus, errors.py](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/python/yt/wrapper/errors.py) и [cypress_commands.py](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/python/yt/wrapper/cypress_commands.py#L24) (HEAD 2026-10-09) · практика, выведенная из репозиториев (код одного проекта - YTsaurus) · низкая · реконструкция.

## 5. Обработка ошибок, логирование, типизация

`except Exception` в коде Яндекса встречается часто (94 случая в `ydb/`, 54 в ch-tools, 50 в dl_core) и дефолтом Аркадии не запрещён: соответствующая проверка pylint `broad-except` стоит в списке игнорируемых. Запрещён только голый `except:`.

Ленивое логирование - устойчивая практика без формального правила: в 10 из 11 измеренных кодовых баз с логированием ленивых вызовов больше, чем f-строк (исключение - тесты `ydb/tests`), хотя дефолтный flake8 Аркадии проверки `logging-not-lazy` игнорирует. Автоматически это проверяют только datalens-backend и YaFSDP.

Полнота аннотаций следует за инструментом, а не за текстом гайда: 99 % полностью аннотированных функций в ch-tools и 93 % в dl_core, где включён `disallow_untyped_defs`, против 28 % в ydb-python-sdk (mypy есть, но без `disallow_untyped_defs`) и 3 % в yt wrapper (гайд аннотаций ожидает, но проверки типов нет).

### Y-PY-025 · MUST · Голый `except:` запрещён - перехватывают конкретный класс исключения
- Проверка: `ruff E722`.
- Источник: [yatool, ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L4) (группа `E7`, 2024-01-24) · конфиг или инструмент · высокая (исключение в выборке - yandex-ai-studio-sdk, где `E722` в списке игнорируемых).

### Y-PY-026 · SHOULD · Библиотека определяет собственную иерархию исключений с одним базовым классом
- Проверка: ручное ревью.
- Источник: [ytsaurus, errors.py](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/python/yt/wrapper/errors.py) (`YtError` → `YtResponseError` → специализированные классы); [ydb-python-sdk, ydb/issues.py](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/ydb/issues.py); [yandex-ai-studio-sdk, exceptions.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/src/yandex_ai_studio_sdk/exceptions.py) (HEAD 2026-10-09, 2026-10-07 и 2026-08-30 соответственно) · практика, выведенная из репозиториев (3 SDK) · средняя · реконструкция.
- Пример:

```python
# хорошо: пользователь ловит один базовый класс или конкретную ошибку
class ClientError(Exception):
    """Base class for all errors raised by the client."""


class ResponseError(ClientError): ...


class SessionExpiredError(ResponseError): ...
```

### Y-PY-027 · SHOULD · Логгер создают один раз на модуль: `logger = logging.getLogger(__name__)`
- Проверка: частично: `ruff LOG001` (прямое создание `logging.Logger`), `LOG002` (`__file__` вместо `__name__`), `LOG015` (вызовы через корневой логгер); остальное - ручное ревью.
- Источник: [ydb-python-sdk, каталог ydb](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/ydb) (2026-10-07) · практика, выведенная из репозиториев (30 из 30 файлов с logging в ydb-python-sdk, 71 из 72 в dl_core, 13 из 14 в testsuite, 11 из 11 в `devtools/ya/handlers`) · высокая · реконструкция. Исключения: YTsaurus использует собственный модуль `yt.logger`, ch-tools с 2024-04-22 - loguru.

### Y-PY-028 · SHOULD · Аргументы в сообщение лога передают лениво, без f-строк, `.format()` и оператора `%`
- Проверка: `ruff G001`-`G004`.
- Источник: [datalens-backend, pyproject.toml](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/pyproject.toml#L122-L146) (2026-09-30); [YaFSDP, pyproject.toml](https://github.com/yandex/YaFSDP/blob/6896a680b08c1e45ec64c60c943f348bad1322fd/pyproject.toml#L33-L51) (2026-10-05) · конфиг или инструмент · средняя (группа `G` включена в 2 из 17; практика в коде шире).
- Пример:

```python
# плохо
logger.info(f"Session {session_id} created in {elapsed:.2f}s")

# хорошо
logger.info("Session %s created in %.2fs", session_id, elapsed)
```

### Y-PY-029 · SHOULD · Вместо устаревшего `logger.warn` вызывают `logger.warning`
- Проверка: `ruff G010`; pre-commit pygrep-hooks `python-no-log-warn`.
- Источник: [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L51) (2026-08-30) · конфиг или инструмент · низкая (хук - в 1 из 17).

### Y-PY-030 · SHOULD · В библиотечном коде нет `print` - сообщения идут через логгер
- Проверка: ручное ревью; по желанию `ruff T201`.
- Источник: [ch-tools, коммит d640627 «Replace print with logging»](https://github.com/yandex/ch-tools/commit/d640627) (2024-05-02) · практика, выведенная из репозиториев (1 из 17) · низкая · реконструкция.

### Y-PY-031 · MUST · Все функции и методы имеют полные аннотации типов
- Проверка: mypy `disallow_untyped_defs = true`.
- Источник: [YTsaurus Python Style Guide, Type annotations](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L70) (2025-07-30) · производный гайд проекта · высокая; [yandex-cloud/python-sdk, pyproject.toml](https://github.com/yandex-cloud/python-sdk/blob/187f99b2aff37457861d1c0faf45c0810c9f8dc3/pyproject.toml#L116-L124) (2026-10-05) · конфиг или инструмент · высокая. Гайд говорит только о публичных методах и переменных и формулирует ожидание; профиль ставит MUST и распространяет правило на все функции, потому что оно соблюдается только там, где его проверяет mypy (`disallow_untyped_defs` включён в python-sdk, ch-tools, datalens-backend; `strict` - в YaFSDP).

### Y-PY-032 · SHOULD · mypy запускают в CI с `check_untyped_defs`, `warn_redundant_casts` и `warn_unused_configs`
- Проверка: `mypy` в CI.
- Источник: [ydb-python-sdk, pyproject.toml](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/pyproject.toml#L4-L15) (mypy добавлен 2026-02-04); [yandex-cloud/python-sdk, pyproject.toml](https://github.com/yandex-cloud/python-sdk/blob/187f99b2aff37457861d1c0faf45c0810c9f8dc3/pyproject.toml#L116-L124) (2026-10-05) · практика, выведенная из репозиториев (mypy - в 11 из 17) · высокая.

### Y-PY-033 · SHOULD · Типизированная библиотека поставляет маркер `py.typed`
- Проверка: ручное ревью (состав пакета).
- Источник: [ydb-python-sdk, setup.py](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/setup.py) (маркер добавлен 2026-09-15) · практика, выведенная из репозиториев (5 из 17) · средняя.

### Y-PY-034 · SHOULD · Отсутствие стабов у зависимости глушат точечно - секцией `[[tool.mypy.overrides]]` для конкретных модулей, а не глобальным `ignore_missing_imports`
- Проверка: ручное ревью конфига.
- Источник: [ydb-python-sdk, pyproject.toml](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/pyproject.toml#L31-L47) (2026-10-07) · конфиг или инструмент · средняя (ch-tools и tabm используют глобальный флаг).

### Y-PY-035 · SHOULD · Подавления проверок точечные и с кодом правила: `# noqa: F401`, `# type: ignore[attr-defined]`
- Проверка: частично: `ruff RUF100` и mypy `warn_unused_ignores` находят лишние подавления; подавления без кода ловят `ruff PGH003`, `PGH004` (по желанию) или pygrep-hooks `python-check-blanket-type-ignore`.
- Источник: [yatool, документация `ya test`, линтеры Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L354-L358) (2026-10-06); [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L50) (2026-08-30); [datalens-backend, lib/dl_query_processing/pyproject.toml](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/lib/dl_query_processing/pyproject.toml#L36) (2026-09-30) · конфиг или инструмент · средняя.

## 6. Запрещённые и ограниченные возможности

Письменного списка запрещённых возможностей Python у Яндекса нет - публичных данных не найдено. Ограничения видны только как набор включённых правил линтера. Ядро - пять групп из дефолтного `ruff.toml` Аркадии; они запрещают, в частности:

| Код | Что запрещено |
|---|---|
| `E401`, `E402` | несколько модулей в одном `import`; импорт не в начале файла |
| `E701`, `E702` | несколько инструкций в одной строке |
| `E711`, `E712` | сравнение с `None`, `True`, `False` через `==` |
| `E713`, `E714` | `not x in y`, `not x is y` |
| `E721` | сравнение типов через `==` вместо `isinstance` |
| `E722` | голый `except:` (Y-PY-025) |
| `E731` | присваивание `lambda` имени |
| `E741` | имена переменных `l`, `O`, `I` |
| `E9` | синтаксические ошибки и ошибки чтения файла |
| `F401`, `F403`, `F405` | неиспользуемые импорты, `import *` (Y-PY-013, Y-PY-014) |
| `F811`, `F821`, `F841` | повторное определение, неопределённое имя, неиспользуемая локальная переменная |
| `W605` | недопустимая escape-последовательность в строке |

Порог цикломатической сложности задаёт один репозиторий из 17 (yandex-cloud/python-sdk, `max-complexity = 15`); в flake8 Аркадии группа `C9` выбрана, но порог не задан. Профиль сложность не ограничивает; в конфиге правило `C901` оставлено закомментированным.

### Y-PY-036 · MUST · Код проходит базовый набор проверок Аркадии: группы `E4`, `E7`, `E9`, `F`, `W`
- Проверка: `ruff check` (`select` в `[tool.ruff.lint]`).
- Источник: [yatool, ruff.toml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/ruff/ruff.toml#L3-L5) (2024-01-24; изменения файла ревьюит Python Committee) · конфиг или инструмент · высокая.

### Y-PY-037 · SHOULD · Остатки Python 2 в новый код не попадают: `six`, `class X(object)`, строка `# -*- coding: utf-8 -*-`, ветки по `sys.version_info`
- Проверка: частично: `ruff UP004`, `UP009`, `UP010`, `UP036`; использование `six` - ручное ревью.
- Источник: [yatool, документация `ya test`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L95) (макрос `PY2TEST` назван устаревшим, 2026-10-06); [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L27-L31) (pyupgrade, 2026-08-30) · конфиг или инструмент · средняя · реконструкция. В старом коде остатки есть: `class X(object)` - 71 раз в ydb-python-sdk и 155 в yt wrapper, `six` - в yatool, `ydb/tests` и CatBoost.

### Y-PY-038 · SHOULD · Конструкции-ловушки из набора flake8-bugbear не используют: изменяемое значение аргумента по умолчанию, вызов функции в значении по умолчанию, `raise` в блоке `except` без `from`
- Проверка: `ruff B` (в примерах - `B006`, `B008`, `B904`).
- Источник: [datalens-backend, pyproject.toml](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/pyproject.toml#L122-L146) (2026-09-30); [YaFSDP, pyproject.toml](https://github.com/yandex/YaFSDP/blob/6896a680b08c1e45ec64c60c943f348bad1322fd/pyproject.toml#L33-L51) (2026-10-05); [yandex-ai-studio-sdk, pyproject.toml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/pyproject.toml#L101-L123) (2026-08-30) · конфиг или инструмент · средняя (3 из 17).
- Пример:

```python
# плохо: один список на все вызовы
def collect(item: str, bucket: list[str] = []) -> list[str]:
    bucket.append(item)
    return bucket

# хорошо
def collect(item: str, bucket: list[str] | None = None) -> list[str]:
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
```

### Y-PY-039 · SHOULD · `eval` в коде не используют
- Проверка: ручное ревью; по желанию `ruff S307` или pre-commit pygrep-hooks `python-no-eval`.
- Источник: [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L52) (2026-08-30) · конфиг или инструмент · низкая (хук - в 1 из 17; группа `S` включена ещё в datalens-backend).

## 7. Тесты

Документация `ya test` называет pytest основным фреймворком тестов Python, и pytest используют 13 из 17 репозиториев выборки (исключения: django-ydb-backend - раннер Django, pgmigrate - behave, tabm - xdoctest, tabred - без тестов). Конфликт: правила для агентов в монорепозитории YDB ([ydb/agents/TESTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/TESTS.md#L13-L26)) предписывают `unittest`, хотя существующие функциональные тесты там же написаны как pytest-классы с PyHamcrest. Профиль берёт pytest: это формулировка документации системы сборки и практика большинства.

Имена: тестовые файлы называются `test_*.py` во всех репозиториях с тестами; единственное исключение - юнит-тесты ydb-python-sdk, лежащие рядом с кодом как `*_test.py`.

### Y-PY-040 · MUST · Тесты пишут на pytest; тестовые файлы называют `test_*.py`
- Проверка: сбор тестов pytest (`testpaths` в `[tool.pytest.ini_options]`); в Аркадии - макросы `PY3TEST()` и `TEST_SRCS()`, файл вне `TEST_SRCS` не запускается.
- Источник: [yatool, документация `ya test`, тестирование для Python](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md#L90-L99) (2026-10-06) · конфиг или инструмент · высокая; практика - 13 из 17 репозиториев.

### Y-PY-041 · MUST · Изменение поведения приходит вместе с тестом
- Проверка: ручное ревью.
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L65-L73) (2026-10-07) · производный гайд проекта · высокая для SDK YDB, средняя как общее правило; [django-ydb-backend, AGENTS.md](https://github.com/ydb-platform/django-ydb-backend/blob/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/AGENTS.md) (2026-06-25) · производный гайд проекта · средняя. В SDK YDB тест дописывают в существующий файл по теме, новые файлы не создают.

### Y-PY-042 · SHOULD · pytest запускают с `--strict-markers`; async-тесты - в режиме `asyncio_mode = "auto"`
- Проверка: `[tool.pytest.ini_options]` (`addopts`, `asyncio_mode`; второй параметр требует плагин pytest-asyncio).
- Источник: [yandex-taxi-testsuite, pytest.ini](https://github.com/yandex/yandex-taxi-testsuite/blob/85b1c33fc1e788f217ddc51c5d16a2736b3061af/pytest.ini) (2026-10-01); [ydb-python-sdk, tox.ini](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/tox.ini#L96-L97) (2026-10-07); [ytsaurus, интеграционные тесты, pytest.ini](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/tests/integration/pytest.ini) (HEAD 2026-10-09) · конфиг или инструмент · средняя (2 из 17 плюс интеграционные тесты YTsaurus).

### Y-PY-043 · SHOULD · CI прогоняет тесты на каждой поддерживаемой версии Python
- Проверка: матрица версий в CI.
- Источник: [ydb-python-sdk, tests.yaml](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/.github/workflows/tests.yaml#L20) (2026-10-07); [yandex-taxi-testsuite, ci.yml](https://github.com/yandex/yandex-taxi-testsuite/blob/85b1c33fc1e788f217ddc51c5d16a2736b3061af/.github/workflows/ci.yml); [ch-tools, workflow.yml](https://github.com/yandex/ch-tools/blob/e2bda7b65af39aef7d0f55a8d00ef0956bce7f93/.github/workflows/workflow.yml) · практика, выведенная из репозиториев (5 из 17; в четырёх - 3.10-3.14, в python-sdk - 3.9-3.13) · высокая.

### Y-PY-044 · SHOULD · Перед пул-реквестом автор локально прогоняет те же проверки, что и CI: формат, линтер, типы, тесты
- Проверка: ручное ревью (CI повторяет проверки).
- Источник: [ydb-python-sdk, AGENTS.md, Code Quality](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md) (2026-10-07; команда `tox -e black && tox -e style && tox -e mypy && tox -e py -- ydb -v`) · производный гайд проекта · высокая для SDK YDB, средняя как общее правило.

### Y-PY-045 · SHOULD · Быстрые юнит-тесты отделены от интеграционных, которым нужно окружение (Docker, база данных, сеть)
- Проверка: ручное ревью (раскладка каталогов или маркеры pytest).
- Источник: [ydb-python-sdk, AGENTS.md, Project Structure](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md) (2026-10-07) · производный гайд проекта · высокая для SDK YDB; та же схема в ch-tools (pytest для юнит-тестов, behave для интеграционных) и datalens-backend (`<пакет>_tests/unit/`) · практика, выведенная из репозиториев (3 из 17) · средняя · реконструкция.

## 8. Версия языка и изменения за 2023-2026 годы

Нижняя граница в активных SDK за 2025-2026 годы сошлась к Python 3.10 (7 из 17 репозиториев; ещё 4 требуют 3.12 и новее). Клиент YTsaurus остаётся на 3.8: гайд требует, чтобы синтаксис был совместим с Python 3.8+. Профиль берёт 3.10; если вы пишете код для каталогов YTsaurus, действует 3.8 (вариант C).

### Y-PY-046 · MUST · Нижняя поддерживаемая версия - Python 3.10; возможности языка и стандартной библиотеки новее неё не используют
- Проверка: `target-version = "py310"` в ruff, `python_version = "3.10"` в mypy, прогон тестов на 3.10 в матрице CI (Y-PY-043).
- Источник: [ydb-python-sdk, AGENTS.md, Key Rules](https://github.com/ydb-platform/ydb-python-sdk/blob/d6391fb4e38bacbbca4a40249fd597ba92f6a93e/AGENTS.md#L73) (2026-10-07) · производный гайд проекта · высокая для SDK YDB, средняя как общее правило (≥3.10 - в 7 из 17); иное значение - [YTsaurus Python Style Guide, General](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/python.md#L18) (3.8+, 2025-07-30).

### Y-PY-047 · SHOULD · Синтаксис автоматически подтягивают к базовой версии: `list[int]` вместо `typing.List[int]`, `X | None` вместо `Optional[X]`
- Проверка: `ruff UP` (например, `UP006`, `UP007`, `UP045`) или pre-commit `pyupgrade --py310-plus`.
- Источник: [yandex-ai-studio-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/e30f36c00819f5f972e3f3e57ea3ef658f963f22/.pre-commit-config.yaml#L27-L31) (2026-08-30); [yandex-cloud/python-sdk, .pre-commit-config.yaml](https://github.com/yandex-cloud/python-sdk/blob/187f99b2aff37457861d1c0faf45c0810c9f8dc3/.pre-commit-config.yaml) (2026-10-05) · конфиг или инструмент · средняя (группа `UP` - в 4 из 17, хук pyupgrade - ещё в 2).

### Что изменилось за последние три года

Главное за 2023-2026 годы - замена flake8, а затем и black, на ruff и подъём нижней версии Python до 3.10. В Аркадии ruff появился как опция в январе 2024 года, но дефолтным форматтером остаётся black.

| Дата | Событие | Источник |
|---|---|---|
| 2023-01-24 | testsuite добавил проверку black; ydb-python-sdk переформатирован black | [testsuite bd31a04](https://github.com/yandex/yandex-taxi-testsuite/commit/bd31a04) |
| 2023-03-23 | ydb-python-sdk перешёл на `line-length = 120` | [ba6c081](https://github.com/ydb-platform/ydb-python-sdk/commit/ba6c081) |
| 2023-08-21 | ch-tools заменил flake8 на ruff (за месяц до этого добавил flake8, pylint и mypy) | [f3da503](https://github.com/yandex/ch-tools/commit/f3da503) |
| 2023-11-29 | первая публикация yatool: дефолты black (120, без нормализации кавычек) и flake8 (200) уже на месте | [dc9c1929](https://github.com/yandex/yatool/commit/dc9c19293b0cdcfcdcf920cd2b53138c865cda84) |
| 2024-01-24 | в yatool добавлены обёртка ruff, макрос `STYLE_RUFF` и дефолтный `ruff.toml` | [7f5fdeb8](https://github.com/yandex/yatool/commit/7f5fdeb8e8df85c1575ba0a0e3b81b1c022ac68c) |
| 2024-04-22 | ch-tools перевёл логирование на loguru, затем заменил `print` на логирование | [e7e8add](https://github.com/yandex/ch-tools/commit/e7e8add) |
| 2024-05-30 | yandex-cloud/python-sdk включил mypy для SDK и proto | [42e725e](https://github.com/yandex-cloud/python-sdk/commit/42e725e) |
| 2025-02-12 … 14 | testsuite добавил mypy, снял Python 3.6 и заменил flake8 и black на ruff (`quote-style = 'single'`) | [9b49696](https://github.com/yandex/yandex-taxi-testsuite/commit/9b49696) |
| 2025-05-24 | ch-tools включил `disallow_untyped_defs` | [5e34607](https://github.com/yandex/ch-tools/commit/5e34607) |
| 2025-07-30 | опубликован YTsaurus Python Style Guide | [770fa32c](https://github.com/ytsaurus/ytsaurus/commit/770fa32c545673e68e936d72af9858373a3aaf1d) |
| 2026-01-27 | yandex-cloud-ml-sdk переименован в yandex-ai-studio-sdk; в том же SDK 3.8 снят 2025-01-31, 3.9 - 2026-03-04, 3.14 добавлен 2026-01-30 | [f8b9dd6](https://github.com/yandex-cloud/yandex-ai-studio-sdk/commit/f8b9dd6) |
| 2026-02-04 | ydb-python-sdk добавил mypy; 2026-07-06 снял 3.8 и 3.9; 2026-09-15 пометил пакет как типизированный | [7a14513](https://github.com/ydb-platform/ydb-python-sdk/commit/7a14513) |

Почему в Аркадии выбраны 120 символов и почему кавычки не нормализуются - публичных данных не найдено.

## 9. Машиночитаемые конфиги

Конфиг профиля: [`../../configs/python/pyproject.toml`](../../configs/python/pyproject.toml) - секции `[tool.ruff]`, `[tool.mypy]`, `[tool.pytest.ini_options]`; секции `[project]` в нём нет, его содержимое переносится в `pyproject.toml` проекта.

| Пакет (PyPI) | Версия, на которой проверен конфиг | Зачем | Версии в репозиториях Яндекса |
|---|---|---|---|
| `ruff` | 0.16.8 | форматтер и линтер | `==0.15.13` (datalens-backend), `>=0.11.0` (ydb-mcp), `^0.11.2` (langchain-ydb), `>=0.9.9,<0.10.0` (django-ydb-backend) |
| `mypy` | 2.3.1 | проверка типов | `==2.1.0` (datalens-backend), `>=1.17` (ch-tools), `>=1.13.0` (python-sdk), `>=1.0.0` (ydb-python-sdk) |
| `pytest` | 9.1.1 | тесты | `>=8.3.4` (python-sdk), `>=7.0.0,<8.0.0` (ydb-python-sdk), `==7.2.2` (datalens-backend) |
| `pytest-asyncio` | не запускался; последний выпуск на [PyPI](https://pypi.org/project/pytest-asyncio/) - 1.4.0 (2026-05-26) | async-тесты, опция `asyncio_mode` | `==0.21.0` (ydb-python-sdk) |
| `black` | 26.5.1 (только вариант B) | форматтер Аркадии | `==25.11.0` (ydb-python-sdk), `==26.5.1` (datalens-backend), `>=24.10.0` (python-sdk) |

Версии black, ruff и flake8 внутри Аркадии не раскрыты: в yatool они заданы идентификаторами ресурсов Sandbox ([resources.json](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/external_resources/ruff/resources.json)).

Команды:

```bash
ruff format --check .     # Y-PY-001 … Y-PY-006; исправить: ruff format .
ruff check .              # линтер; автоисправление: ruff check --fix .
mypy src tests            # Y-PY-031, Y-PY-032
pytest                    # Y-PY-040, Y-PY-042
```

Что проверено локально (2026-10-09, Python 3.13.16): файл разбирается `tomllib`; `ruff check --show-settings` показывает `line_length = 120`, целевую версию 3.10, `quote_style = double`; на тестовом пакете `ruff check`, `ruff format --check`, `mypy` и `pytest` проходят; на файле с нарушениями срабатывают `E401`, `E711`, `E722`, `F401`, `F403`, `F841`, `I001`, `N801`, `N802`, `UP004`, `B006`, `G004`, `G010`, `LOG015` и ошибка mypy `no-untyped-def`. Варианты B и C и надстройки для Django и FastAPI проверены отдельно; результат записан в комментариях конфига. `pytest-asyncio` не установлен в среде сборки, поэтому строка `asyncio_mode` в конфиге закомментирована.

Что в конфиге сверх дефолта Аркадии и откуда:

| Опция | Откуда | Правило |
|---|---|---|
| `select`: `I` | ydb-mcp, langchain-ydb, tabred, YaFSDP, testsuite | Y-PY-011 |
| `select`: `UP` | datalens-backend, tabm, tabred, YaFSDP; хук pyupgrade в двух SDK | Y-PY-037, Y-PY-047 |
| `select`: `B` | datalens-backend, YaFSDP, yandex-ai-studio-sdk | Y-PY-038 |
| `select`: `N` | flake8 Аркадии (`N8`), datalens-backend, YaFSDP | Y-PY-009 |
| `select`: `RUF` | datalens-backend, tabm, tabred, YaFSDP | Y-PY-035 |
| `select`: `G`, `LOG` | datalens-backend, YaFSDP | Y-PY-027 … Y-PY-029 |
| `ignore`: `E501` | ch-tools, datalens-backend | Y-PY-002 |
| `ignore`: `RUF001`-`RUF003` | datalens-backend | Y-PY-022 |
| `quote-style = "double"` | гайд YTsaurus; поведение black по умолчанию | Y-PY-004 |
| mypy: `disallow_untyped_defs`, `check_untyped_defs` | python-sdk, ch-tools, datalens-backend | Y-PY-031, Y-PY-032 |
| mypy: `warn_unused_ignores` | datalens-backend (85 из 87 пакетов) | Y-PY-035 |
| mypy: `no_implicit_optional`, `show_error_codes` | ydb-python-sdk | Y-PY-032 |
| pytest: `--strict-markers`, `-ra` | testsuite, интеграционные тесты YTsaurus; datalens-backend | Y-PY-042 |

Конфиг pyright в профиль не включён: pyright настроен только в двух исследовательских репозиториях (tabm, tabred).

## 10. Что проверяет инструмент, а что - ревью

Полная матрица профиля - в [`../enforcement.md`](../enforcement.md). Сводка по Python:

| Способ проверки | Правил | Идентификаторы |
|---|---|---|
| Инструмент, полностью | 23 | Y-PY-001 … 006, 008, 009, 011, 013, 014, 025, 028, 029, 031, 032, 036, 038, 040, 042, 043, 046, 047 |
| Инструмент, частично | 4 | Y-PY-016, 027, 035, 037 |
| Ручное ревью | 20 | Y-PY-007, 010, 012, 015, 017 … 024, 026, 030, 033, 034, 039, 041, 044, 045 |

По инструментам среди 23 автоматических правил: `ruff format` - 5 (Y-PY-001 … 005), `ruff check` - 11, mypy - 2, pytest и матрица CI - 3, исключения в конфиге - 1, целевая версия - 1.

Тот же набор в Аркадии, по открытым конфигам yatool:

| Что | В git-репозитории (профиль) | В Аркадии (`ya make -t`, открытые конфиги) |
|---|---|---|
| Длина строки, раскладка скобок | `ruff format` | black или `ruff format` - только если проект включил макрос; flake8 ловит лишь строки длиннее 200 |
| Кавычки | `ruff format` | не проверяются (`skip-string-normalization`, группа `Q` в flake8 закомментирована) |
| Базовые ошибки, именование | `ruff` (`E4`, `E7`, `E9`, `F`, `W`, `N`) | flake8 автоматически (`E`, `W`, `F`, `N8`) |
| Порядок импортов | `ruff I001` | не проверяется (`wrong-import-order` в списке игнорируемых) |
| Аннотации и типы | mypy | в открытых конфигах проверки типов нет |
| Логирование | `ruff G`, `LOG` | не проверяется (`logging-not-lazy` в списке игнорируемых) |
| Наличие docstring | не проверяется | не проверяется (`missing-*-docstring` в списке игнорируемых) |
| Импортируемость модулей | частично (сбор pytest, mypy) | автоматический `import_test` |
| Тесты | pytest | `PY3TEST()` + `TEST_SRCS()` |

Интерпретация: по открытым конфигам автоматика Аркадии для Python мягче, чем у отдельных открытых проектов Яндекса, - в дефолте нет ни сортировки импортов, ни проверки типов, ни контроля кавычек. Строгие проверки команды включают сами. Внутренние механизмы сверх открытых (обязательность `STYLE_PYTHON()` для новых проектов, проверки в Arcanum) - публичных данных не найдено.

## 11. Чего в публичных источниках нет

- Гайд «Python в Аркадии», правила и состав Python Committee - публичных данных не найдено.
- Файл правил `python-style.mdc`, на который ссылаются комментарии в конфиге datalens-backend, в открытом репозитории отсутствует.
- Правила о структуре пакета, именах каталогов, выборе `dataclasses` / `attrs` / `pydantic`, стиле async-кода - публичных данных не найдено.
- Доля проектов Аркадии, включивших `STYLE_PYTHON()` или `STYLE_RUFF()`, - публичных данных не найдено.
- Хендбуки education.yandex.ru и материалы Яндекс Практикума - учебные материалы, а не производственный стандарт; как источник правил профиля не использовались.

Правила для фреймворков - в [`../frameworks/django.md`](../frameworks/django.md) и [`../frameworks/fastapi.md`](../frameworks/fastapi.md).
