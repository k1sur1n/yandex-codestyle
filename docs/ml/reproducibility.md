# Воспроизводимость и трекинг экспериментов: профиль Яндекса

> Данные актуальны на 2026-10-09.

Письменные правила Яндекса о воспроизводимости есть только в документации продуктов: CatBoost описывает сид, недетерминированность обучения на GPU, различия значений по умолчанию на CPU и GPU и условия возобновления из снапшота; DataSphere советует виртуальное окружение и сохранение промежуточных результатов. Общего стандарта - как сидировать, фиксировать окружение и вести трекинг - нет: публичных данных не найдено. Остальное реконструировано по 12 репозиториям `yandex-research`: сид задаётся в коде во всех двенадцати, половина хранит `uv.lock`, а роль трекера у группы табличного DL играют файлы `report.json` в git. Внешний сервер трекинга (MLflow) Яндекс рекомендует только пользователям своего облака.

Области идентификаторов: `Y-REPRO` - этот документ, `Y-ML` - [project-structure.md](project-structure.md), `Y-NB` - [notebooks.md](notebooks.md). Версионирование данных и моделей, реестр и пайплайны - в [mlops.md](mlops.md); остальные рекомендации CatBoost и других библиотек - в [libraries.md](libraries.md).

## 1. Что публично есть у Яндекса и чего нет

### 1.1. Письменные источники

| Источник | Что сказано | Дата или версия |
|---|---|---|
| [CatBoost: параметр `random_seed`](https://catboost.ai/docs/en/references/training-parameters/common#random_seed) | Сид обучения; по умолчанию в Python - `None`, что равно 0, в CLI и R - 0 | CatBoost 1.2.10, документация на 2026-10-09 |
| [CatBoost: Training on GPU](https://catboost.ai/docs/en/features/training-on-gpu) и [FAQ](https://catboost.ai/docs/en/concepts/faq#differencies-between-cpu-and-gpu) | Обучение на GPU недетерминировано из-за порядка суммирования чисел с плавающей точкой; значения параметров по умолчанию на CPU и GPU различаются | то же |
| [CatBoost: Snapshots](https://catboost.ai/docs/en/features/snapshots) | Параметры `save_snapshot`, `snapshot_file`, `snapshot_interval`; возобновлять обучение нужно в том же каталоге и с теми же параметрами | то же |
| [CatBoost: TensorBoard](https://catboost.ai/docs/en/features/visualization_tensorboard) | Метрики обучения пишутся в `train_dir` и открываются командой `tensorboard --logdir=<train_dir>` | то же |
| [CatBoost: Development and contributions](https://catboost.ai/docs/en/concepts/development-and-contributions) | Тесты сравнивают вывод с каноническими данными утилитами сравнения с ограниченной точностью | то же |
| [DataSphere: среда исполнения заданий](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/environment) | Окружение задания собирается из Docker-образа и конфигурации; совет запускать задания в виртуальном окружении Python; поддерживаются Python 3.8-3.12 | 2026-06-16 |
| [DataSphere: задания](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/) | Для длинных заданий рекомендовано сохранять промежуточный результат в объектном хранилище; данные задания по умолчанию живут 14 дней | 2026-06-24 |
| [Yandex Cloud: сервер MLflow для DataSphere](https://yandex.cloud/ru/docs/tutorials/ml-ai/mlflow-datasphere) | Туториал: MLflow Tracking Server на отдельной ВМ, метаданные в Managed PostgreSQL, артефакты в Object Storage | 2026-09-09 |
| [Хабр: «Познаём Нирвану»](https://habr.com/ru/companies/yandex/articles/351016) | Историческое описание: при перезапуске графа детерминированные блоки берут результат из кэша; команда Погоды пишет, что платформа гарантирует воспроизводимость экспериментов | 2018-03-12, не обновляется |

Документация DataSphere и туториал Yandex Cloud адресованы внешним пользователям облака; это не внутренний стандарт. Статья о Нирване описывает состояние на 2018 год.

### 1.2. Практика репозиториев (реконструкция)

Выборка: 12 из 59 репозиториев `yandex-research`, клоны от 2026-10-09 (состав - в [project-structure.md](project-structure.md)).

| Практика | Доля | Комментарий |
|---|---|---|
| Сид выставляется в коде явно | 12 из 12 | `delu.random.seed(config['seed'])` - 6 из 12, `torch.manual_seed` и аналоги - остальные |
| Сид читается из файла конфига | 6 из 12 | группа табличного и графового DL; сид - первое поле конфига |
| `torch.backends.cudnn.deterministic = True` | 9 из 12 | кроме ar-classifier, dlm-mmd, urban-traffic-benchmark |
| `torch.use_deterministic_algorithms(True)` | 1 из 12 | AsyncReasoning, в сквозном тесте |
| Сиды воркеров или процессов выводятся из базового сида | 3 из 12 | graphpfn, switti, tabpack |
| `PYTHONHASHSEED` выставляется | 2 из 12 | swd, switti |
| `pyproject.toml` и `uv.lock` в git | 6 из 12 | G2T-FM, graphpfn, tabm, tabpack, tabred, tabular-dl-optimizers |
| `requirements.txt` | 5 из 12 | точные версии `==` у всех основных зависимостей - 2 из 5 (swd, switti) |
| conda `environment.yml` | 1 из 12 | ar-classifier |
| `.python-version` | 3 из 12 | graphpfn, tabm, tabpack; у G2T-FM `requires-python = "==3.12.9"` |
| `report.json` на каждый запуск, файлы в git | 4 из 12 | tabm, tabred, tabular-dl-optimizers, tabpack |
| В отчёт или аргументы запуска пишется коммит git | 3 из 12 | G2T-FM, graphpfn, switti |
| Оценка по нескольким сидам описана в README | 3 из 12 | tabm, tabpack, tabular-dl-optimizers |
| TensorBoard `SummaryWriter` | 6 из 12 | G2T-FM, graphpfn, switti, tabm, tabred, tabular-dl-optimizers; swd - через `accelerate`, TensorBoard по умолчанию |
| `wandb` | 1 из 12 | dlm-mmd, включается опцией конфига |
| MLflow, ClearML, Neptune | 0 из 12 | - |

YaFSDP фиксирует окружение примеров Dockerfile'ом: базовый образ `nvcr.io/nvidia/pytorch:24.02-py3` и теги `transformers` v4.39-release, `accelerate` v0.27.0-release, `trl` v0.8.3; файл не менялся с 2024-05-27, а в самом пакете зависимость `torch` версией не ограничена.

### 1.3. Чего нет

Публичных данных не найдено:

- общий стандарт Яндекса по сидам, детерминизму и фиксации окружения ML-проектов;
- внутренний трекинг экспериментов: чем пользуются команды внутри Яндекса, публично не описано; свежего описания Нирваны после 2018 года нет;
- обещание побитовой воспроизводимости обучения CatBoost на CPU: документация прямо говорит только о недетерминированности GPU;
- поддерживаемые версии PyTorch для YaFSDP.

## 2. Сиды

### Y-REPRO-001 · SHOULD · Сид задавать полем конфига запуска и выставлять один раз в начале запуска для всех генераторов
- Проверка: частично: тест или grep в CI - в каждом конфиге есть поле `seed`; остальное - ручное ревью.
- Источник: [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10) · практика, выведенная из репозиториев (сид в коде - 12 из 12; из конфига - 6 из 12) · средняя · реконструкция.
- Пример:

```python
# плохо: сид зашит в код и не попадает в отчёт
torch.manual_seed(42)

# хорошо: сид приходит из конфига и выставляется для всех генераторов
def seed_everything(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def main(config: dict) -> None:
    seed_everything(config["seed"])
```

В группе табличного DL эту работу делает один вызов `delu.random.seed(config['seed'])`.

### Y-REPRO-002 · SHOULD · Сиды параллельных воркеров и процессов выводить из базового сида и номера воркера, а в `DataLoader` передавать `worker_init_fn` и генератор
- Проверка: ручное ревью.
- Источник: [graphpfn: paper/lib/graphpfn/prior/sampler.py](https://github.com/yandex-research/graphpfn/blob/HEAD/paper/lib/graphpfn/prior/sampler.py) (2026-07-03) · практика, выведенная из репозиториев (3 из 12) · низкая · реконструкция; [PyTorch: Reproducibility](https://docs.pytorch.org/docs/2.14/notes/randomness.html) (PyTorch 2.14) · официальный гайд · высокая · не Яндекс.

В graphpfn сид воркера - сумма базового сида и номера воркера; в switti сид процесса вычисляется из базового сида, числа процессов и ранга. Заметки PyTorch (не Яндекс) дают готовый рецепт для `DataLoader`: функция `worker_init_fn`, сидирующая NumPy и `random` в каждом воркере, и объект `torch.Generator` с заданным сидом в параметре `generator`.

### Y-REPRO-003 · SHOULD · Итоговую метрику считать по нескольким сидам и приводить среднее и стандартное отклонение
- Проверка: ручное ревью.
- Источник: [tabm/paper/README.md, разделы Metrics и Evaluation](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10); [tabular-dl-optimizers README](https://github.com/yandex-research/tabular-dl-optimizers/blob/HEAD/README.md) (2026-04-17) · практика, выведенная из репозиториев (3 из 12: tabm, tabpack, tabular-dl-optimizers) · средняя · реконструкция.

В tabm отдельный скрипт `bin/evaluate.py` обучает модель под несколькими сидами, а README содержит код, который сводит отчёты в среднее и стандартное отклонение; в tabular-dl-optimizers число сидов задаётся флагом `--n-seeds`.

### Y-REPRO-004 · SHOULD · Объектам scikit-learn и NumPy передавать `random_state` или генератор явно, не полагаясь только на глобальный сид
- Проверка: частично: поиск вызовов разбиений и моделей scikit-learn без `random_state` (grep); остальное - ручное ревью.
- Источник: [scikit-learn: Common pitfalls and recommended practices](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn 1.9.1) · официальный гайд · высокая · не Яндекс.

Здесь источники расходятся. Практика репозиториев Яндекса - глобальный сид в начале запуска (Y-REPRO-001; `np.random.seed` встречается в 5 из 12). Документация scikit-learn глобальный сид NumPy не рекомендует и советует передавать `random_state` в каждый объект. Профиль берёт оба приёма: глобальный сид закрывает код, которым автор не управляет, а явный `random_state` делает разбиения данных независимыми от порядка вызовов.

## 3. Детерминизм

### Y-REPRO-005 · SHOULD · В запусках PyTorch, которые нужно повторять, выключать `cudnn.benchmark` и включать `cudnn.deterministic`
- Проверка: частично: поиск `cudnn.benchmark = True` в коде обучения (grep); остальное - ручное ревью.
- Источник: [tabm: paper/lib/util.py](https://github.com/yandex-research/tabm/blob/main/paper/lib/util.py) (2025-11-10) · практика, выведенная из репозиториев (`cudnn.deterministic` - 9 из 12) · средняя · реконструкция; [PyTorch: Reproducibility](https://docs.pytorch.org/docs/2.14/notes/randomness.html) (PyTorch 2.14) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
# плохо для повторяемого эксперимента: cuDNN выбирает алгоритм по замерам
torch.backends.cudnn.benchmark = True

# хорошо: настройка из общего модуля группы табличного DL (tabm, tabpack, graphpfn)
torch.set_num_threads(1)
torch.backends.cuda.matmul.allow_tf32 = False
torch.backends.cudnn.allow_tf32 = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True
```

Более строгий режим - `torch.use_deterministic_algorithms(True)` из заметок PyTorch (не Яндекс); в выборке он включён в одном репозитории из двенадцати, и то в тесте. У детерминизма есть цена: [руководство PyTorch по производительности](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (не Яндекс), наоборот, советует `cudnn.benchmark = True` для свёрточных сетей с постоянным размером входа. Профиль рекомендует детерминированные настройки для экспериментов, результаты которых сравнивают, и допускает `benchmark = True` в продакшен-обучении, где важнее скорость; выбор записывается в конфиг.

### Y-REPRO-006 · SHOULD · Не рассчитывать на побитовое совпадение результатов между CPU и GPU, версиями библиотек и платформами; сравнивать запуски по метрикам с допуском
- Проверка: ручное ревью.
- Источник: [CatBoost: Training on GPU](https://catboost.ai/docs/en/features/training-on-gpu) (CatBoost 1.2.10, документация на 2026-10-09) · официальный гайд · высокая · реконструкция; [PyTorch: Reproducibility](https://docs.pytorch.org/docs/2.14/notes/randomness.html) (PyTorch 2.14) · официальный гайд · высокая · не Яндекс.

CatBoost прямо называет обучение на GPU недетерминированным. PyTorch (не Яндекс) не гарантирует полной воспроизводимости между релизами, отдельными коммитами и платформами, а также между CPU и GPU. Правило - вывод авторов профиля из этих двух утверждений.

## 4. CatBoost: документированные параметры

Документация CatBoost - единственный письменный источник Яндекса, где воспроизводимость описана на уровне параметров.

| Параметр или свойство | Что сказано в документации | Что из этого следует |
|---|---|---|
| [`random_seed`](https://catboost.ai/docs/en/references/training-parameters/common#random_seed) (синоним `random_state`) | Сид обучения; в Python по умолчанию `None`, что равно 0, в CLI и R - 0 | Сид фиксирован и без указания, но в конфиг его пишут явно: Y-REPRO-001, со стороны библиотеки - правило Y-LIB-008 в [libraries.md](libraries.md) |
| `task_type` (CPU или GPU) | [Обучение на GPU недетерминировано](https://catboost.ai/docs/en/features/training-on-gpu): порядок суммирования чисел с плавающей точкой не определён | Тип устройства записывают в отчёт; запуски сравнивают с допуском (Y-REPRO-006) |
| `border_count`, `bootstrap_type`, `boosting_type`, `model_size_reg` | [Значения по умолчанию зависят от устройства](https://catboost.ai/docs/en/concepts/faq#differencies-between-cpu-and-gpu): `border_count` равен 254 на CPU и 128 на GPU, `model_size_reg` включён только на CPU; `ctr_leaf_count_limit` и `monotone_constraints` на GPU не поддерживаются | Y-REPRO-007 |
| `save_snapshot`, `snapshot_file`, `snapshot_interval` | [Снапшоты](https://catboost.ai/docs/en/features/snapshots): интервал записи по умолчанию 600 секунд; возобновлять обучение нужно в том же каталоге и с теми же параметрами | Правило Y-LIB-011 в [libraries.md](libraries.md); общий принцип - Y-REPRO-015 |
| `train_dir` | Каталог файлов, создаваемых при обучении; метрики открываются командой `tensorboard --logdir=<train_dir>` | Y-REPRO-012 |

Обещания побитовой воспроизводимости на CPU в документации нет: она прямо говорит только о GPU. Вывод «для точного повтора нужны CPU и фиксированный сид» - интерпретация, а не утверждение источника. CatBoost for Apache Spark отдельно заявляет воспроизводимые результаты обучения ([обзор](https://catboost.ai/docs/en/concepts/spark-overview)).

### Y-REPRO-007 · SHOULD · При сравнении запусков CatBoost на CPU и GPU явно задавать параметры, у которых значение по умолчанию зависит от устройства
- Проверка: ручное ревью.
- Источник: [CatBoost FAQ: различия CPU и GPU](https://catboost.ai/docs/en/concepts/faq#differencies-between-cpu-and-gpu) (CatBoost 1.2.10, документация на 2026-10-09) · официальный гайд · высокая · реконструкция.

Документация перечисляет различия; требование задавать эти параметры явно - вывод авторов профиля: иначе один и тот же конфиг описывает на двух устройствах разные модели.

## 5. Окружение и версии зависимостей

**Факты.** Половина выборки `yandex-research` (6 из 12) описывает окружение в `pyproject.toml` и хранит `uv.lock` в git; ещё пять репозиториев используют `requirements.txt`, один - conda. В tabred почти все зависимости группы `data` (подготовка датасетов) закреплены точными версиями, и комментарий в `pyproject.toml` объясняет это воспроизводимостью артефактов датасета. DataSphere собирает окружение задания из Docker-образа и файла конфигурации.

**Что берёт профиль.** `pyproject.toml` и `uv.lock`: это самый частый вариант в свежих репозиториях, и lock-файл закрепляет и прямые, и транзитивные зависимости. `requirements.txt` с точными версиями - допустимая альтернатива для небольшого репозитория.

### Y-REPRO-008 · SHOULD · Зависимости описывать в `pyproject.toml`, а lock-файл и `.python-version` хранить в git
- Проверка: в CI - `uv lock --check` и `uv sync --locked` (флаги проверены локально: uv 0.11.32); файл `uv.lock` не числится в `.gitignore`.
- Источник: [tabpack pyproject.toml](https://github.com/yandex-research/tabpack/blob/HEAD/pyproject.toml) (2026-08-13) · практика, выведенная из репозиториев (`uv.lock` - 6 из 12; `.python-version` - 3 из 12) · средняя · реконструкция.

В самих репозиториях README предлагает `uv sync` без флага; строгий режим в CI - добавление профиля.

### Y-REPRO-009 · SHOULD · Если lock-файла нет, закреплять в `requirements.txt` точные версии всех зависимостей через `==`
- Проверка: частично: поиск строк без `==` в `requirements.txt`; остальное - ручное ревью.
- Источник: [swd requirements.txt](https://github.com/yandex-research/swd/blob/HEAD/requirements.txt) (2026-03-12) · практика, выведенная из репозиториев (2 из 5 репозиториев с `requirements.txt`) · низкая · реконструкция.
- Пример:

```text
# плохо: через месяц установится другое окружение
torch>=2.6
transformers

# хорошо
torch==2.10.0
transformers==5.2.0
```

Профиль здесь строже большинства: три репозитория из пяти смешивают `==`, `>=` и зависимости без версий.

### Y-REPRO-010 · SHOULD · Обучение запускать в изолированном окружении: локально и в заданиях - виртуальное окружение, на кластере - Docker-образ с закреплённым тегом базового образа
- Проверка: частично: поиск в `Dockerfile` базовых образов без тега версии или с тегом `latest` (grep); остальное - ручное ревью.
- Источник: [DataSphere: среда исполнения заданий](https://yandex.cloud/ru/docs/datasphere/concepts/jobs/environment) (2026-06-16) · официальный гайд · высокая; [YaFSDP: docker/Dockerfile](https://github.com/yandex/YaFSDP/blob/HEAD/docker/Dockerfile) (2024-05-27, с тех пор не обновлялся) · конфиг или инструмент · средняя · реконструкция.

DataSphere формулирует это как совет запускать задания в виртуальном окружении, чтобы контролировать все параметры запуска. Dockerfile YaFSDP закрепляет тег базового образа и теги клонируемых библиотек.

## 6. Отчёт о запуске, метрики и трекинг

**Факты.** У группы табличного DL трекер заменён файлами: каждый запуск оставляет рядом с конфигом `report.json`, и эти отчёты лежат в git (в tabm - 21 214 файлов). Отчёт tabm содержит имя функции запуска, модель GPU, полный конфиг, число параметров, лучший шаг, метрики на train, val и test и время работы. G2T-FM и graphpfn добавляют в отчёт хеш коммита git и отказываются продолжать запуск, если конфиг в существующем отчёте отличается от нового. Кривые обучения пишутся в TensorBoard (6 из 12) как локальный лог, а не как общий сервис. Внешние трекеры почти не встречаются: `wandb` - в одном репозитории, MLflow - ни в одном.

Для пользователей облака Яндекс публикует другой путь: туториалы Yandex Cloud предлагают поднять MLflow Tracking Server для DataSphere и вести эксперименты и реестр моделей через MLflow API в Managed GitLab (подробности - в [mlops.md](mlops.md)).

**Чего нет.** Чем ведут трекинг экспериментов команды внутри Яндекса - публичных данных не найдено.

### Y-REPRO-011 · SHOULD · Каждый запуск оставляет `report.json` с полным конфигом, метриками на train, val и test, сведениями об оборудовании, временем работы и хешем коммита git
- Проверка: тест скрипта обучения проверяет наличие полей отчёта.
- Источник: [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10); [G2T-FM: lib/util.py](https://github.com/yandex-research/G2T-FM/blob/HEAD/lib/util.py) (2026-06-22) · практика, выведенная из репозиториев (`report.json` в git - 4 из 12; коммит в отчёте - 3 из 12) · средняя · реконструкция.
- Пример:

```json
{
  "function": "bin.model.main",
  "commit": "<SHA>",
  "gpus": ["NVIDIA A100-SXM4-80GB"],
  "config": {"seed": 0, "batch_size": 256, "model": {"n_blocks": 3}},
  "n_parameters": 438688,
  "best_step": 10868,
  "metrics": {"train": {"rmse": 0.35}, "val": {"rmse": 0.44}, "test": {"rmse": 0.44}},
  "time": "0:00:36"
}
```

Версии ключевых библиотек в отчётах выборки не записываются; профиль рекомендует добавить их, когда lock-файла нет (следствие Y-REPRO-006). Куда отчёт кладётся и что из каталога запуска коммитится - Y-ML-010 и Y-ML-011.

### Y-REPRO-012 · SHOULD · Кривые обучения писать локальным логгером в каталог запуска, а итог запуска - в `report.json`
- Проверка: частично: `events.out.tfevents.*` в `.gitignore`; остальное - ручное ревью.
- Источник: [tabm: paper/bin/model.py](https://github.com/yandex-research/tabm/blob/main/paper/bin/model.py) (2025-11-10) · практика, выведенная из репозиториев (TensorBoard - 6 из 12) · средняя · реконструкция; [CatBoost: TensorBoard](https://catboost.ai/docs/en/features/visualization_tensorboard) (CatBoost 1.2.10) · официальный гайд · высокая.

### Y-REPRO-013 · SHOULD · Когда запуски сравнивает команда или их слишком много для файлов в git, записывать параметры, метрики и артефакты в общий сервер трекинга
- Проверка: ручное ревью.
- Источник: [Yandex Cloud: сервер MLflow для DataSphere](https://yandex.cloud/ru/docs/tutorials/ml-ai/mlflow-datasphere) (2026-09-09) · официальный гайд · средняя · реконструкция; [MLflow Tracking](https://mlflow.org/docs/latest/ml/tracking/) (MLflow 3) · официальный гайд · высокая · не Яндекс.

Туториал - рекомендация пользователям Yandex Cloud, а не описание внутренней практики. Схема из него: сервер трекинга на отдельной ВМ, метаданные в PostgreSQL, артефакты в объектном хранилище, ключи доступа в секретах. В MLflow (не Яндекс) запуск записывается как run с параметрами, метриками и артефактами; командная установка использует Tracking Server.

## 7. Повтор и продолжение запуска

### Y-REPRO-014 · SHOULD · Опубликованный результат воспроизводить копированием его конфига в отдельный каталог, не перезаписывая исходный результат
- Проверка: ручное ревью.
- Источник: [tabm/paper/README.md, раздел Training](https://github.com/yandex-research/tabm/blob/main/paper/README.md) (2025-11-10); [tabpack README, раздел Reproducing experiments](https://github.com/yandex-research/tabpack/blob/HEAD/README.md) (2026-08-13) · практика, выведенная из репозиториев (2 из 12) · средняя · реконструкция.

### Y-REPRO-015 · SHOULD · Прерванный запуск продолжать только с тем же конфигом; при расхождении конфига с сохранённым отчётом останавливаться с ошибкой
- Проверка: тест: запуск с изменённым конфигом поверх существующего каталога результата завершается ошибкой.
- Источник: [G2T-FM: lib/util.py](https://github.com/yandex-research/G2T-FM/blob/HEAD/lib/util.py) (2026-06-22) · практика, выведенная из репозиториев (2 из 12: G2T-FM, graphpfn) · низкая · реконструкция; [CatBoost: Snapshots](https://catboost.ai/docs/en/features/snapshots) (CatBoost 1.2.10, документация на 2026-10-09) · официальный гайд · высокая.

В G2T-FM и graphpfn функция создания отчёта сверяет новый конфиг с конфигом из существующего `report.json` и при расхождении бросает исключение; без флага продолжения существующий отчёт - тоже ошибка. CatBoost требует того же от снапшотов: тот же каталог и те же параметры. Сохранять состояние длинного запуска во внешнее хранилище рекомендует DataSphere - это правило Y-MLOPS-007 в [mlops.md](mlops.md). В urban-traffic-benchmark виден след внутренней инфраструктуры: модуль `nirvana_utils.py` копирует состояние вытесненного запуска в «snapshot path» и обратно.

## 8. Проверка воспроизводимости

### Y-REPRO-016 · SHOULD · Воспроизводимость проверять тестом: короткий запуск с фиксированным сидом сравнивается с эталонным результатом с заданным допуском
- Проверка: тест в CI; эталонные значения хранятся в репозитории рядом с тестом.
- Источник: [CatBoost: Development and contributions, раздел Run tests](https://catboost.ai/docs/en/concepts/development-and-contributions) (CatBoost 1.2.10, документация на 2026-10-09) · официальный гайд · средняя · реконструкция.

CatBoost проверяет себя именно так: тесты из `catboost/pytest` сравнивают вывод с каноническими данными, а для сравнения собираются утилиты `limited_precision_dsv_diff`, `limited_precision_json_diff` и `model_comparator`. Документация описывает тесты самого CatBoost; перенос приёма на свой проект - решение профиля. Допуск обязателен на GPU и при смене версий библиотек (Y-REPRO-006).

## 9. Сводка: практика Яндекса и рекомендация профиля

| Тема | Что видно у Яндекса | Рекомендация профиля |
|---|---|---|
| Сид | в коде - 12 из 12; в конфиге - 6 из 12 | сид - поле конфига (Y-REPRO-001) |
| Детерминизм PyTorch | флаги cuDNN - 9 из 12; строгий режим - 1 из 12 | флаги cuDNN для сравниваемых экспериментов (Y-REPRO-005) |
| CatBoost | сид по умолчанию фиксирован; GPU недетерминирован; значения по умолчанию зависят от устройства | сид явно (Y-REPRO-001), допуск при сравнении (Y-REPRO-006), параметры устройства явно (Y-REPRO-007) |
| Окружение | `uv.lock` - 6 из 12; точные версии в `requirements.txt` - 2 из 5 | lock-файл в git и строгая установка в CI (Y-REPRO-008) |
| Трекинг | `report.json` в git - 4 из 12; TensorBoard - 6 из 12; MLflow - 0 из 12 | `report.json` всегда, сервер трекинга - для команды (Y-REPRO-011, Y-REPRO-013) |
| Продолжение запуска | флаг `--continue`; сверка конфига с отчётом - 2 из 12; снапшоты CatBoost | только с тем же конфигом (Y-REPRO-015) |
| Тест воспроизводимости | канонические данные в тестах CatBoost; в `yandex-research` тесты - 1 из 12 | тест с эталоном и допуском (Y-REPRO-016) |
