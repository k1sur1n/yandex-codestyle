# Структура ML-проекта: профиль Яндекса

> Данные актуальны на 2026-10-09.

Письменного правила Яндекса о структуре ML-проекта, границе «исследование - продакшен», конфигах экспериментов и типизации тензоров нет: публичных данных не найдено. Есть три вида опоры: документация продуктов (Yandex DataSphere, CatBoost), конфиги открытых библиотек (YaFSDP, Yandex AI Studio SDK) и наблюдаемая практика исследовательских репозиториев `yandex-research` (выборка 12 из 59). Поэтому почти все правила ниже - реконструкция с указанной долей либо общепринятая практика с пометкой «не Яндекс»; уровень у них SHOULD. Там, где наблюдаемая практика слабее общепринятой (нет тестов, нет CI), это сказано прямо.

Области идентификаторов: `Y-ML` - этот документ, `Y-NB` - [notebooks.md](notebooks.md), `Y-REPRO` - [reproducibility.md](reproducibility.md). Пайплайны, реестр моделей, мониторинг и список того, что нельзя коммитить, разобраны в [mlops.md](mlops.md); правила конкретных библиотек - в [libraries.md](libraries.md).

Как читать строку «Источник»: тип источника описывает сам источник; пометка «не Яндекс» означает, что это не правило и не практика Яндекса; пометка «реконструкция» означает, что правило сформулировано авторами профиля по наблюдениям, а в источнике нормой не названо.

## 1. Что публично есть у Яндекса и чего нет

### 1.1. Три вида источников

| Вид | Источник | Что в нём есть | Дата |
|---|---|---|---|
| (а) письменный | [DataSphere: задания (Jobs)](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/), [среда исполнения заданий](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/environment) | Единственная явная граница «ноутбук → скрипт» в документации Яндекса; советы про точки входа и окружение | 2026-06-24, 2026-06-16 |
| (а) письменный | [CatBoost: Development and contributions](https://catboost.ai/docs/en/concepts/development-and-contributions), [дополнения команды CatBoost к стайлгайду C++](https://github.com/catboost/catboost/blob/master/catboost_command_style_guide_extension.md) | Где лежат тесты C++-библиотек; правила C++-кода ML-библиотеки | документация на 2026-10-09 (CatBoost 1.2.10); дополнения не обновляются с 2023-12-01 |
| (а) письменный, учебный | [Хендбук по машинному обучению (ШАД)](https://education.yandex.ru/handbook/ml) | Учебный материал, не производственный стандарт; глав о структуре кода, ноутбуках и воспроизводимости нет | дата не указана |
| (б) реконструкция | 12 репозиториев [yandex-research](https://github.com/yandex-research) из 59 | Раскладка каталогов, конфиги запусков, каталоги результатов, инструменты проверки | клоны от 2026-10-09 |
| (б) реконструкция | [YaFSDP](https://github.com/yandex/YaFSDP), [Yandex AI Studio SDK](https://github.com/yandex-cloud/yandex-ai-studio-sdk), [CatBoost](https://github.com/catboost/catboost) | Раскладка библиотек, конфиги линтеров и проверки типов | HEAD от 2026-10-05, 2026-08-30 (v0.22.1) и 2026-10-09 |
| (в) альтернатива, не Яндекс | [Cookiecutter Data Science](https://cookiecutter-data-science.drivendata.org/) v2 | Шаблон структуры проекта и его принципы | v2.3.0, 2025-07-23 |

Выборка `yandex-research`: dlm-mmd, ar-classifier, tabpack, tabred, graphpfn, G2T-FM, AsyncReasoning, urban-traffic-benchmark, tabular-dl-optimizers, swd, tabm, switti. Она смещена к самым свежим репозиториям, а шесть из двенадцати принадлежат одной группе (табличное и графовое глубокое обучение) и используют общий модуль `lib`. Доли нельзя переносить на всю организацию и тем более на внутренний код Яндекса.

### 1.2. Как выглядят репозитории

**Исследовательские репозитории (12 из 59).** Единого шаблона на организацию нет; у группы табличного и графового DL он общий.

| Практика | Доля | Комментарий |
|---|---|---|
| Фреймворк PyTorch | 12 из 12 | JAX и TensorFlow - 0 из 12 |
| Каталог скриптов (`bin/` или `scripts/`) отдельно от каталога модулей (`lib/` или `src/`) | 7 из 12 | G2T-FM, graphpfn, tabm, tabpack, tabred, tabular-dl-optimizers, dlm-mmd; у остальных точки входа лежат в корне |
| Код статьи в `paper/`, переиспользуемый пакет отдельно | 3 из 12 | tabm, graphpfn, tabred |
| Сторонний код в `vendor/` | 5 из 12 | тексты лицензий рядом - у 3 из 5 (G2T-FM и graphpfn: `NOTICE` и `LICENSES/`; dlm-mmd: файл лицензии в `vendor/`) |
| Конфиги экспериментов в TOML | 5 из 12 | G2T-FM, graphpfn, tabm, tabred, tabular-dl-optimizers |
| Конфиги в JSON | 1 из 12 | tabpack |
| YAML и OmegaConf | 2 из 12 | dlm-mmd, ar-classifier |
| Только аргументы командной строки | 4 из 12 | AsyncReasoning, swd, urban-traffic-benchmark, switti |
| Hydra, gin, ml_collections | 0 из 12 | - |
| `report.json` рядом с конфигом, файлы закоммичены | 4 из 12 | tabm (21 214 отчётов), tabred (5 704), tabular-dl-optimizers (952), tabpack (137) |
| Конфиг ruff в `pyproject.toml` | 6 из 12 | длина строки 88 в пяти, 120 в tabred |
| Конфиг mypy, pyright или `ty` | 6 из 12 | те же шесть репозиториев группы |
| Тесты | 1 из 12 | tabm (`xdoctest` и проверка блоков кода из README) |
| GitHub Actions, `.pre-commit-config.yaml` | 0 из 12 | - |
| Ссылка на статью или BibTeX в README | 12 из 12 | - |
| Файл лицензии | 10 из 12 | без лицензии - ar-classifier и tabpack |

**Библиотеки.** YaFSDP - плоский пакет `ya_fsdp/` в корне (приватные модули с подчёркиванием: `_api.py`, `_state.py`), рядом `examples/`, `docs/`, `patches/`, `docker/`, `justfile` и `pyproject.toml`; тестов и CI в публичном репозитории нет. Yandex AI Studio SDK - раскладка `src/yandex_ai_studio_sdk/` с приватными модулями (`_auth.py`, `_retry.py`) и публичными реэкспортами, отдельные `tests/`, `examples/sync` и `examples/async`, `docs/`, `tox.ini`, `.pre-commit-config.yaml` и GitHub Actions. Обе библиотеки поставляют `py.typed`.

**CatBoost.** Репозиторий выгружается из монорепозитория (в корне лежат `.mapping.json` и `.piglet-meta.json`), поэтому повторяет раскладку Аркадии: общие каталоги `util/`, `library/`, `contrib/`, `build/` и каталог продукта `catboost/` с C++-библиотеками в `catboost/libs/<имя>/`, приложением командной строки в `catboost/app/` и обёртками для языков (`python-package/`, `R-package/`, `jvm-packages/`, `spark/`, `node-package/`, `rust-package/`, `dotnet/`). Подробнее - в разделе 6.

### 1.3. Чего нет

Публичных данных не найдено по следующим темам:

- правила структуры ML-проекта и разделения исследовательского и продакшен-кода в Аркадии;
- стандарт конфигов экспериментов;
- правила типизации данных и тензоров;
- единый формат docstring для ML-кода;
- правила C++-кода инференса сверх общего стиля Аркадии и документации CatBoost.

## 2. Раскладка каталогов

### 2.1. Два набора имён в репозиториях Яндекса

В группе табличного глубокого обучения встречаются два набора имён с одинаковым смыслом.

| Назначение | tabpack (2026-08) | tabm, tabred, G2T-FM, tabular-dl-optimizers |
|---|---|---|
| Конфиги запусков и результаты | `experiments/` | `exp/` |
| Исполняемые скрипты | `scripts/` | `bin/` |
| Импортируемые модули | `src/lib`, `src/project` | `lib/` |
| Сторонний код | `src/vendor/` | `vendor/` |
| Код статьи отдельно от пакета | - | `paper/` (tabm, tabred, graphpfn) |

Источники: [README tabpack](https://github.com/yandex-research/tabpack/blob/HEAD/README.md), [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md), [README G2T-FM](https://github.com/yandex-research/G2T-FM/blob/HEAD/README.md), [README tabular-dl-optimizers](https://github.com/yandex-research/tabular-dl-optimizers/blob/HEAD/README.md).

**Что берёт профиль.** Имена tabpack: это самый новый репозиторий группы, и назначение каждого каталога описано в его README. Вариант `bin/` + `lib/` + `exp/` равноправен; важно само разделение (Y-ML-001), а не имена. Интерпретация: выбор имён сделан авторами профиля, Яндекс его не формулировал.

```text
<PROJECT>/
├── README.md          # статья и BibTeX, установка, данные, быстрый тест, воспроизведение
├── LICENSE
├── pyproject.toml     # зависимости, ruff, проверка типов
├── uv.lock            # lock-файл хранится в git (Y-REPRO-008)
├── .python-version
├── experiments/       # конфиги запусков и каталоги результатов с report.json
├── scripts/           # исполняемые скрипты; никогда не импортируются
├── src/
│   ├── lib/           # общий код, переиспользуемый между проектами
│   ├── project/       # код этого проекта
│   └── vendor/        # сторонний код без изменений, с лицензиями
└── notebooks/         # если есть; правила - в notebooks.md
```

Данных, весов и чекпойнтов в дереве нет: во всех 12 репозиториях README отправляет за ними во внешнее хранилище (Hugging Face, Kaggle). Что именно не коммитится - правило Y-MLOPS-001 в [mlops.md](mlops.md).

### 2.2. Общепринятая альтернатива - не Яндекс

[Cookiecutter Data Science](https://cookiecutter-data-science.drivendata.org/) v2 (DrivenData) предлагает другую раскладку: `data/{external,interim,processed,raw}`, `models/`, `notebooks/`, `reports/figures/`, `references/`, `docs/`, `Makefile` и пакет с модулями `config.py`, `dataset.py`, `features.py`, `modeling/train.py`, `modeling/predict.py`, `plots.py`. Она удобнее для прикладной аналитики, где данные лежат на диске рядом с кодом. Раскладка `yandex-research` удобнее для серии экспериментов с опубликованными конфигами. Смешивать их можно: каталог `data/` из Cookiecutter Data Science добавляется к дереву выше без конфликтов (Y-ML-005).

### Y-ML-001 · SHOULD · Исполняемые скрипты держать отдельно от импортируемых модулей; скрипты никто не импортирует
- Проверка: частично: поиск `import scripts` и `from scripts` в `src/` (grep в CI); остальное - ручное ревью.
- Источник: [tabpack README, раздел Overview](https://github.com/yandex-research/tabpack/blob/HEAD/README.md) (2026-08-13); [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10) · практика, выведенная из репозиториев (7 из 12) · средняя · реконструкция.

### Y-ML-002 · SHOULD · Код статьи хранить отдельно от переиспользуемой реализации: статья - в `paper/`, реализация - отдельным пакетом
- Проверка: ручное ревью.
- Источник: [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10); [graphpfn README](https://github.com/yandex-research/graphpfn/blob/HEAD/README.md) (2026-07-03) · практика, выведенная из репозиториев (3 из 12: tabm, graphpfn, tabred) · низкая · реконструкция.

В tabm исходная реализация из `paper/bin/model.py` объявлена заменённой пакетом `tabm`: для практического использования README отправляет к пакету, а `paper/` остаётся для воспроизведения статьи. Это единственное место, где исследовательский репозиторий Яндекса сам проводит границу «код для статьи - код для использования».

### Y-ML-003 · SHOULD · Сторонний код класть в `vendor/` и сопровождать файлом `NOTICE` и каталогом `LICENSES/`; правки в нём не делать или перечислять в `NOTICE`
- Проверка: частично: `vendor/` исключён из ruff и mypy в `pyproject.toml`, скрипт в CI проверяет наличие `NOTICE` и `LICENSES/` при непустом `vendor/`; остальное - ручное ревью.
- Источник: [G2T-FM NOTICE](https://github.com/yandex-research/G2T-FM/blob/HEAD/NOTICE) (2026-06-22); [tabpack pyproject.toml](https://github.com/yandex-research/tabpack/blob/HEAD/pyproject.toml) (2026-08-13) · практика, выведенная из репозиториев (`vendor/` - 5 из 12; тексты лицензий - 3 из 5) · средняя · реконструкция.

Здесь профиль строже наблюдаемой практики: файлы лицензий есть не у всех репозиториев с `vendor/`, но без текста лицензии сторонний код нельзя законно распространять дальше. Tabpack описывает `src/vendor` как неизменённый сторонний код и исключает его из ruff, mypy и `ty`; G2T-FM допускает в `vendor/` минимальные правки импортов.

### Y-ML-004 · SHOULD · В README исследовательского репозитория давать ссылку на статью с BibTeX, установку, получение данных, быстрый тест окружения и команды воспроизведения
- Проверка: ручное ревью.
- Источник: [tabpack README](https://github.com/yandex-research/tabpack/blob/HEAD/README.md) (2026-08-13) · практика, выведенная из репозиториев (ссылка на статью или BibTeX - 12 из 12; раздел «Quick test» - tabpack и tabm) · средняя · реконструкция.

### Y-ML-005 · SHOULD · Сырые данные считать неизменяемыми и отделять от промежуточных и обработанных: `data/raw`, `data/interim`, `data/processed`
- Проверка: частично: `data/` в `.gitignore`; остальное - ручное ревью.
- Источник: [Cookiecutter Data Science, Opinions](https://cookiecutter-data-science.drivendata.org/opinions/) (v2.3.0, 2025-07-23) · сторонний источник · высокая · не Яндекс.

## 3. Граница между исследовательским и продакшен-кодом

**Факты.** Документация Яндекса проводит эту границу в одном месте - в DataSphere: задания (Jobs) запускают скрипты, проекты и бинарные файлы вне JupyterLab и не зависят от ноутбуков и запущенных ВМ проекта. Задание описывается файлом `config.yaml` с полями `name`, `desc`, `cmd`, `inputs`, `outputs`, `env` и другими. Страница о среде исполнения в блоке «Важно» просит использовать `if __name__ == "__main__":` для всех точек входа.

В `yandex-research` границы другие: «статья против библиотеки» (Y-ML-002) и «скрипты против модулей» (Y-ML-001).

**Чего нет.** Правил перевода исследовательского кода в продакшен внутри Яндекса публично нет: публичных данных не найдено. В исследовательских репозиториях нет CI (0 из 12) и почти нет тестов (1 из 12); в библиотеках картина другая: у Yandex AI Studio SDK есть тесты по матрице Python 3.10-3.14, pre-commit и CI, у YaFSDP - строгая проверка типов.

**Что рекомендует профиль.** Исследовательский код живёт по правилам этого документа. Код, который запускается по расписанию или обслуживает запросы, дополнительно подчиняется [Python-профилю](../languages/python.md), проходит CI (Y-MLOPS-008) и оформляется как задание или пайплайн с декларативным описанием (Y-ML-007, Y-MLOPS-006 в [mlops.md](mlops.md)). Интерпретация: это рекомендация профиля; у Яндекса такого письменного правила нет.

### Y-ML-006 · SHOULD · У каждой точки входа ставить `if __name__ == "__main__":`
- Проверка: частично: поиск файлов в `scripts/` без этой конструкции (grep в CI; у ruff такого правила нет); остальное - ручное ревью.
- Источник: [DataSphere: среда исполнения заданий](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/environment) (2026-06-16) · официальный гайд · высокая; в источнике это требование к заданиям DataSphere, для произвольного репозитория профиль оставляет уровень SHOULD.
- Пример:

```python
# плохо: обучение стартует при импорте модуля
config = load_config("experiments/baseline/config.toml")
train(config)

# хорошо
def main() -> None:
    config = load_config("experiments/baseline/config.toml")
    train(config)


if __name__ == "__main__":
    main()
```

### Y-ML-007 · SHOULD · Запуск, который нужно повторять, оформлять скриптом с декларативным описанием команды, входов, выходов и окружения, а не ноутбуком
- Проверка: ручное ревью.
- Источник: [DataSphere: задания](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/) (2026-06-24) · официальный гайд · средняя · реконструкция.

Документация описывает свойство продукта: задание не зависит от ноутбука и задаётся файлом `config.yaml`. Правило для произвольного репозитория - вывод авторов профиля. Когда переносить код из ноутбука в модуль, сказано в Y-NB-002 и Y-NB-003.

### Y-ML-008 · SHOULD · Все проверки качества собирать в одну именованную команду и запускать команды из корня репозитория
- Проверка: частично: CI вызывает цель `check` или `lint` из `justfile` или `Makefile`; состав цели - ручное ревью.
- Источник: [YaFSDP justfile](https://github.com/yandex/YaFSDP/blob/HEAD/justfile) (HEAD от 2026-10-05); [tabm Makefile](https://github.com/yandex-research/tabm/blob/main/Makefile) (2025-11-10) · конфиг или инструмент · средняя · реконструкция.

В YaFSDP это цели `check` (формат, линтер, типы, орфография), `fix` и `test`; в tabm - `lint` (typos, ruff), `doctest`, `typecheck` (mypy) и общая цель `pre-commit`; в tabpack проверки `ruff check`, `ruff format --check` и `ty check` входят в «Quick test» из README, там же сказано, что все команды запускаются из корня репозитория.

## 4. Конфиги экспериментов

**Факты.** Единого формата нет (таблица в разделе 1.2). У группы табличного глубокого обучения контракт запуска одинаков: скрипт получает один конфиг и создаёт рядом с ним каталог результата. В tabm это записано в README: `bin/model.py` принимает один TOML-конфиг и создаёт каталог рядом с ним; `report.json` назван главным результатом запуска и содержит все метрики и гиперпараметры; флаг `--continue` продолжает прерванный запуск, `--force` перезаписывает готовый результат. Сид - первое поле конфига. Готовый запуск в tabm и tabred помечается файлом `DONE`; в tabpack и G2T-FM принят обратный маркер `_RUNNING` - его держат под контролем версий, чтобы случайно закоммиченный отчёт незавершённого запуска был заметен.

**Что берёт профиль.** TOML: это самый частый формат среди репозиториев с файлами конфигов (5 из 8), и он читается стандартной библиотекой Python (`tomllib`). JSON (tabpack) и YAML с OmegaConf (dlm-mmd, ar-classifier) - наблюдаемые альтернативы. Hydra, gin и ml_collections в выборке не встречаются; публичных данных об их использовании в Яндексе не найдено.

```toml
# experiments/mlp/california/evaluation/0.toml
seed = 0
batch_size = 256
patience = 16

[data]
path = "data/california"

[model]
n_blocks = 3
d_block = 512
dropout = 0.1

[optimizer]
type = "AdamW"
lr = 3e-4
weight_decay = 1e-5
```

```text
experiments/mlp/california/evaluation/
├── 0.toml             # вход: конфиг запуска с сидом 0
├── 0/                 # выход: каталог создаёт скрипт
│   ├── report.json    # конфиг целиком, метрики, сведения о запуске
│   ├── checkpoint.pt  # не коммитится
│   └── DONE           # маркер завершения
├── 1.toml
└── 1/
```

### Y-ML-009 · SHOULD · Один запуск - один файл конфигурации (TOML или JSON); скрипт получает путь к нему как единственный обязательный вход
- Проверка: ручное ревью.
- Источник: [tabm/paper/README.md, раздел Common guidelines](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10) · практика, выведенная из репозиториев (файл конфига на запуск - 6 из 12: TOML - 5, JSON - 1) · средняя · реконструкция. Стандартный `tomllib` появился в Python 3.11; при нижней версии 3.10 (Y-PY-046) для TOML нужен пакет `tomli` - либо берите JSON.

### Y-ML-010 · SHOULD · Результат запуска писать в каталог рядом с конфигом: `report.json` с полным конфигом и метриками и маркер состояния; готовый результат не перезаписывать без явного флага
- Проверка: частично: тест скрипта обучения на отказ при существующем каталоге результата; остальное - ручное ревью.
- Источник: [tabm/paper/README.md, раздел Common guidelines](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10) · практика, выведенная из репозиториев (`report.json` в git - 4 из 12; код, пишущий `report.json`, - 6 из 12) · средняя · реконструкция.

Содержимое `report.json` описано в Y-REPRO-011.

### Y-ML-011 · SHOULD · В дереве экспериментов коммитить только конфиги, отчёты и маркеры: игнорировать всё остальное по умолчанию и разрешать нужные файлы поимённо
- Проверка: шаблон в `.gitignore` (пример ниже).
- Источник: [tabm .gitignore](https://github.com/yandex-research/tabm/blob/main/.gitignore) (2025-11-10); [tabpack .gitignore](https://github.com/yandex-research/tabpack/blob/HEAD/.gitignore) (2026-08-13) · конфиг или инструмент · средняя · реконструкция.
- Пример:

```gitignore
# плохо: перечислять то, что нельзя коммитить, - новый тип файла попадёт в git
experiments/**/checkpoint.pt

# хорошо: запретить всё и разрешить конфиги, отчёты и маркеры
experiments/**
!experiments/**/
!experiments/**/config.json
!experiments/**/*.toml
!experiments/**/report.json
!experiments/**/DONE
```

Так устроены `.gitignore` в tabm (разрешены `DONE`, `report.json`, `*.toml`), tabpack (`config.json`, `report.json`, `_RUNNING`) и G2T-FM. Общий список того, что не коммитится в ML-репозитории, - Y-MLOPS-001 в [mlops.md](mlops.md).

## 5. Типизация данных и тензоров, docstring

### 5.1. Статическая типизация

**Факты.** YaFSDP включает `mypy` со `strict = true` и поставляет `py.typed`. Yandex AI Studio SDK поставляет `py.typed`, запускает mypy и хуком `python-check-blanket-type-ignore` запрещает комментарии `# type: ignore` без кода ошибки. В `yandex-research` конфиг проверки типов (mypy, pyright или `ty`) есть в 6 из 12 репозиториев.

### Y-ML-012 · SHOULD · Аннотировать функции ML-кода и проверять типы статически; в библиотеке включать строгий режим и поставлять `py.typed`
- Проверка: `mypy` с `strict = true` или `disallow_untyped_defs = true` (как в [Python-профиле](../languages/python.md)); хук `python-check-blanket-type-ignore` из `pre-commit/pygrep-hooks`.
- Источник: [YaFSDP pyproject.toml](https://github.com/yandex/YaFSDP/blob/HEAD/pyproject.toml) (HEAD от 2026-10-05); [AI Studio SDK .pre-commit-config.yaml](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/.pre-commit-config.yaml) (v0.22.1) · конфиг или инструмент · средняя · реконструкция.

### 5.2. Формат docstring

**Факты.** Единого формата нет. Google-стиль используют YaFSDP (`[tool.ruff.lint.pydocstyle] convention = "google"`) и tabm (`pdoc -d google`); reST-поля Sphinx (`:param name:`) - Yandex AI Studio SDK; NumPy-стиль - CatBoost. Наличие docstring при этом не проверяется: YaFSDP отключает группу правил `D1`.

**Что берёт профиль.** Формат один на репозиторий и закреплён в конфиге линтера. Базовый формат задан в [Python-профиле](../languages/python.md). Для ML-библиотек на PyTorch допустим Google-стиль, как в YaFSDP и tabm. Интерпретация: выбор между форматами Яндекс публично не обосновывал.

### Y-ML-013 · SHOULD · Формат docstring выбирать один на репозиторий и закреплять в конфиге линтера
- Проверка: `ruff` с правилами `D` и опцией `[tool.ruff.lint.pydocstyle] convention` (`"google"`, `"numpy"` или `"pep257"`). Для reST-полей, которые выбирает Y-PY-021 в [../languages/python.md](../languages/python.md), у ruff своей `convention` нет: тогда включают только общие правила `D` (`pep257`), а поля `:param:`/`:return:` проверяют на ревью.
- Источник: [YaFSDP pyproject.toml](https://github.com/yandex/YaFSDP/blob/HEAD/pyproject.toml) (HEAD от 2026-10-05); [tabm Makefile](https://github.com/yandex-research/tabm/blob/main/Makefile) (2025-11-10) · конфиг или инструмент · средняя · реконструкция.

### 5.3. Формы и типы тензоров

**Факты.** Письменных правил Яндекса о типизации форм и dtype тензоров нет: публичных данных не найдено. В выборке `yandex-research` библиотеки аннотаций форм (jaxtyping, torchtyping) и проверки типов во время выполнения (beartype, typeguard) не используются: 0 из 12 (поиск по коду и файлам зависимостей). Наблюдаются два приёма:

- комментарий с формой рядом с операцией: `# (B, K, D)` или `# (B, D) -> (B, K, D)` - tabm, graphpfn;
- в публикуемом пакете tabm - раздел `**Shape**` в docstring модуля и проверка числа измерений на входе с исключением `ValueError`, в сообщении которого названы ожидаемая и полученная форма ([tabm.py](https://github.com/yandex-research/tabm/blob/main/tabm.py)).

В C++ тот же приём виден в дополнениях команды CatBoost: пример объявления функции содержит комментарий с размерностями вложенного контейнера (`// [iter][test][metric]`).

### Y-ML-014 · SHOULD · Форму тензоров на входе и выходе публичного модуля записывать в docstring и проверять на входе с понятным исключением
- Проверка: частично: модульный тест на неверную форму входа; остальное - ручное ревью.
- Источник: [tabm.py](https://github.com/yandex-research/tabm/blob/main/tabm.py) (2025-11-10) · практика, выведенная из репозиториев (1 из 12; комментарии с формами - ещё в graphpfn) · низкая · реконструкция.
- Пример:

```python
# плохо: форма известна только автору, ошибка всплывёт глубоко внутри
def forward(self, x):
    return self.blocks(x)


# хорошо: форма записана и проверяется на входе
def forward(self, x: Tensor) -> Tensor:
    """Apply the ensemble.

    **Shape**

    - Input: ``(batch_size, k, d_in)``
    - Output: ``(batch_size, k, d_out)``
    """
    if x.ndim != 3:
        raise ValueError(f"The input must have 3 dimensions, however: {x.ndim=}")
    return self.blocks(x)  # (B, K, D_IN) -> (B, K, D_OUT)
```

**Альтернатива - не Яндекс.** Аннотации с формой и dtype даёт библиотека [jaxtyping](https://docs.kidger.site/jaxtyping/): запись вида `Float[Tensor, "batch dim"]` поддерживается для PyTorch, NumPy, JAX, MLX и TensorFlow, зависимости от JAX нет, а проверку во время выполнения выполняют сторонние пакеты typeguard или beartype. В репозиториях Яндекса она не встречается; профиль её не требует.

### 5.4. Табличные данные

**Факты.** CatBoost требует, чтобы значения категориальных признаков были строками или целыми, а не float и не NaN, и советует в pandas тип `Categorical` вместо `object` (правила Y-LIB-002 и Y-LIB-003 в [libraries.md](libraries.md)). TabReD описывает формат датасета на диске: `x_num.npy`, `y.npy`, `info.json` и каталог `splits/` ([readme TabReD](https://github.com/yandex-research/tabred/blob/HEAD/readme.md)). Других публичных правил типизации данных нет.

### Y-ML-015 · SHOULD · Схему табличных данных - имена столбцов, dtype, список категориальных признаков - проверять тестом до обучения
- Проверка: тест данных на dtype и список категориальных признаков в CI.
- Источник: [CatBoost FAQ: Why are float and NaN values forbidden for categorical features](https://catboost.ai/docs/en/concepts/faq#why-float-and-nan-values-are-forbidden-for-cat-features) (документация на 2026-10-09, CatBoost 1.2.10) · официальный гайд · средняя · реконструкция.

Документация формулирует требование к данным; оформить его тестом - рекомендация профиля. Причина требования: у числа с плавающей точкой и у пропуска нет единственного строкового представления (`1.0` и `1`, `None` и `N/A`), поэтому хеш категории при обучении из матрицы может не совпасть с хешем при применении из файла.

## 6. C++ в ML: раскладка кода

**Факты.** Публичные правила есть только у CatBoost. Стиль C++ задан файлом `CPP_STYLE_GUIDE.md` и дополнениями команды - они разобраны в [C++-профиле](../languages/cpp.md); отдельного стиля для ML-кода нет (Y-MLOPS-022 в [mlops.md](mlops.md)). К раскладке кода относятся три наблюдения:

- библиотеки лежат в `catboost/libs/<имя>/` ([дерево на коммите 963da01](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs)), каждая со своей целью сборки; модульные тесты - в подкаталоге `ut` той же библиотеки, цель называется по пути (`x/y/z/ut` → `x-y-z-ut`);
- обучение и применение разнесены: модель и её вычисление - `catboost/libs/model`, обучение - `catboost/libs/train_lib`, C API для применения - `catboost/libs/model_interface`; документация отдельно описывает библиотеку применения `libcatboostmodel` (какой способ применения выбирать - Y-LIB-010 в [libraries.md](libraries.md));
- сквозные тесты сравнивают вывод с каноническими данными (`catboost/pytest/canondata`), см. Y-REPRO-016.

**Чего нет.** Публичных правил Яндекса для C++-кода инференса, отличных от общего стиля Аркадии и документации CatBoost, не найдено.

### Y-ML-016 · SHOULD · C++-код ML-библиотеки делить на библиотеки-каталоги, а модульные тесты класть в подкаталог `ut` рядом с кодом библиотеки
- Проверка: ручное ревью.
- Источник: [CatBoost: Development and contributions, раздел Run tests](https://catboost.ai/docs/en/concepts/development-and-contributions) (документация на 2026-10-09, CatBoost 1.2.10) · официальный гайд · высокая · реконструкция.

Документация описывает, где лежат тесты CatBoost, а не предписывает раскладку чужим проектам; перенос на свой репозиторий - решение профиля.

### Y-ML-017 · SHOULD · Код применения модели выделять в отдельную библиотеку с собственным узким интерфейсом, не зависящую от кода обучения
- Проверка: ручное ревью.
- Источник: [catboost/libs на коммите 963da01](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs) (2026-10-09) · практика, выведенная из репозиториев (1 репозиторий: CatBoost) · низкая · реконструкция.

### Y-ML-018 · SHOULD · Для размеров и индексов данных в C++ брать беззнаковые типы фиксированного размера, по умолчанию 64-битные
- Проверка: ручное ревью.
- Источник: [catboost_command_style_guide_extension.md, пункт 13](https://github.com/catboost/catboost/blob/master/catboost_command_style_guide_extension.md) (не обновляется с 2023-12-01) · производный гайд проекта · средняя; уровень SHOULD - по формулировке самого пункта («следует предпочитать»).

В CatBoost это типы `ui64` и `ui32` из `util`; обоснование в источнике - библиотека работает с потенциально большими данными. В проекте без `util` им соответствуют `std::uint64_t` и `std::uint32_t` (интерпретация авторов профиля).

## 7. Где профиль расходится с наблюдаемой практикой

| Тема | Наблюдение в `yandex-research` | Рекомендация профиля | Почему |
|---|---|---|---|
| Тесты | 1 из 12 | Тесты нужны коду, который переживёт статью | Исследовательский репозиторий замораживается после публикации, рабочий - нет |
| CI | 0 из 12 | CI нужен командному репозиторию (Y-MLOPS-008 в [mlops.md](mlops.md)) | В библиотеках Яндекса CI есть (Yandex AI Studio SDK) |
| Лицензии стороннего кода | у 3 из 5 репозиториев с `vendor/` | `NOTICE` и `LICENSES/` (Y-ML-003) | Требование лицензий стороннего кода |
| Файл лицензии | 2 из 12 без лицензии | Лицензия обязательна, см. [repository.md](../git/repository.md) | Код без лицензии нельзя использовать |
| Формы тензоров | комментарии; проверка на входе - 1 из 12 | Docstring и проверка на входе (Y-ML-014) | Ошибка формы обнаруживается у границы модуля, а не внутри модели |
