# Правила работы с ML-библиотеками: профиль Яндекса

> Данные актуальны на 2026-10-09.

Самый содержательный публичный источник норм Яндекса по ML - документация CatBoost: она прямо запрещает one-hot-кодирование до обучения, описывает подбор числа деревьев и ограничения экспорта. У YaFSDP документация отстала от кода (README и migration guide - 2024-08-19, новый API в коде - с 2025-01-28, последний коммит - 2026-10-05), поэтому правила для него взяты из кода. Правила для Yandex AI Studio SDK собраны из документации сервиса и исходников. Глубокое обучение в открытых проектах Яндекса построено на PyTorch и экосистеме Hugging Face; собственных правил Яндекса для этих библиотек нет - публичных данных не найдено, поэтому для них приведены официальные рекомендации самих проектов с пометкой «не Яндекс».

Области идентификаторов: `Y-LIB` (этот документ), `Y-MLOPS` ([mlops.md](mlops.md)), `Y-ML` ([project-structure.md](project-structure.md)), `Y-NB` ([notebooks.md](notebooks.md)), `Y-REPRO` ([reproducibility.md](reproducibility.md)). Сиды, детерминизм и фиксация окружения описаны в [reproducibility.md](reproducibility.md); здесь остаются только особенности конкретных библиотек.

## 1. Версии и источники

| Библиотека | Версия, на которую опираются правила | Источник | Статус |
|---|---|---|---|
| CatBoost | 1.2.10 (2026-02-19); исходники документации - HEAD от 2026-10-09 | [catboost.ai/docs](https://catboost.ai/docs/), [catboost/docs/en](https://github.com/catboost/catboost/tree/master/catboost/docs/en) | активен, Apache-2.0 |
| YaFSDP | код - HEAD от 2026-10-05; README и migration guide - от 2024-08-19 | [yandex/YaFSDP](https://github.com/yandex/YaFSDP) | код активен, документация не обновляется; релизных тегов нет; Apache-2.0 |
| Yandex AI Studio SDK | v0.22.1 (2026-07-15) | [yandex-cloud/yandex-ai-studio-sdk](https://github.com/yandex-cloud/yandex-ai-studio-sdk), [документация](https://aistudio.yandex.ru/ru/docs/ai-studio/sdk/) | активен, стадия Alpha, Apache-2.0 |
| Проекты yandex-research | 12 репозиториев, клоны от 2026-10-09 | [yandex-research](https://github.com/yandex-research) | исследовательский код; требования мягче, чем к библиотекам |
| PyTorch (не Яндекс) | документация 2.14 | [docs.pytorch.org](https://docs.pytorch.org/docs/2.14/notes/randomness.html) | активен |
| scikit-learn (не Яндекс) | 1.9.1 | [scikit-learn.org](https://scikit-learn.org/stable/common_pitfalls.html) | активен |
| Hugging Face (не Яндекс) | Transformers v5.17.0, документация Hub | [huggingface.co/docs](https://huggingface.co/docs/transformers/philosophy) | активен |
| MLflow, DVC (не Яндекс) | MLflow 3; версия DVC на страницах не указана | [mlflow.org](https://mlflow.org/docs/latest/ml/tracking/), [doc.dvc.org](https://doc.dvc.org/start) | активны |

Уровни: `MUST` - когда источник формулирует запрет или требование либо нарушение приводит к ошибке; `SHOULD` - рекомендации и правила, восстановленные по коду. Слово «антипаттерн» в источниках Яндекса не используется: для YaFSDP и SDK столбец антипаттернов сформулирован авторами профиля по коду и предупреждениям.

## 2. Сводная таблица

### 2.1. Библиотеки Яндекса

| Библиотека | Рекомендации | Антипаттерны | Источник | Уверенность |
|---|---|---|---|---|
| CatBoost | Категориальные признаки передавать как есть через `cat_features`; порог one-hot задавать встроенным параметром `one_hot_max_size` (Y-LIB-001) | One-hot-кодирование на этапе препроцессинга | [parameter-tuning: one-hot](https://catboost.ai/docs/en/concepts/parameter-tuning#one-hot-enc) | высокая |
| CatBoost | Значения категориальных признаков - строки или целые (Y-LIB-002); в pandas - тип `Categorical` (Y-LIB-003) | float, NaN и None в категориальных признаках; столбцы типа `object` | [FAQ](https://catboost.ai/docs/en/concepts/faq#why-float-and-nan-values-are-forbidden-for-cat-features), [speed-up-training](https://catboost.ai/docs/en/concepts/speed-up-training#pandas-instead-of-objects) | высокая |
| CatBoost | Большое `iterations`, `eval_set`, детектор переобучения и `use_best_model`; `eval_metric` может отличаться от функции потерь (Y-LIB-004) | Настраивать остальные параметры, не проверив недо- и переобучение; `od_pval` вместе с детектором типа `Iter` | [parameter-tuning: число деревьев](https://catboost.ai/docs/en/concepts/parameter-tuning#trees-number), [overfitting-detector](https://catboost.ai/docs/en/concepts/overfitting-detector) | высокая |
| CatBoost | Веса и baseline валидационного набора задавать через `Pool` | в источнике не названы | [FAQ](https://catboost.ai/docs/en/concepts/faq#specify-weights-baseline-for-eval-set) | высокая |
| CatBoost | По результатам `cv` выбирать только число итераций (Y-LIB-005) | Ждать от `cv` лучшую модель или подбор параметров | [FAQ](https://catboost.ai/docs/en/concepts/faq#how-to-get-best-parameters-from-the-cv-function) | высокая |
| CatBoost | Глубина 6-10; learning rate оставлять автоматическим и менять по признакам переобучения (Y-LIB-006) | Глубина больше 10 без необходимости | [parameter-tuning: глубина](https://catboost.ai/docs/en/concepts/parameter-tuning#tree-depth), [learning rate](https://catboost.ai/docs/en/concepts/parameter-tuning#learning-rate) | высокая |
| CatBoost | 1024 границы - только для одного-двух «золотых» признаков (Y-LIB-007); в остальных случаях 128 хватает, на GPU для качества - 254 | Повышать `border_count` для всех признаков | [parameter-tuning: golden features](https://catboost.ai/docs/en/concepts/parameter-tuning#golden-features), [border count](https://catboost.ai/docs/en/concepts/parameter-tuning#border-count) | высокая |
| CatBoost | Симметричные деревья по умолчанию: они применяются примерно в 10 раз быстрее | Ждать экспорта моделей `Depthwise` и `Lossguide` в форматы кроме JSON и `cbm`; `max_leaves` больше 64 | [parameter-tuning: политика роста](https://catboost.ai/docs/en/concepts/parameter-tuning#tree-growing-policy) | высокая |
| CatBoost | Фиксировать `random_seed`, записывать `task_type`; помнить о разных значениях по умолчанию на CPU и GPU (Y-LIB-008) | Рассчитывать на детерминированное обучение на GPU | [training-on-gpu](https://catboost.ai/docs/en/features/training-on-gpu), [FAQ: CPU и GPU](https://catboost.ai/docs/en/concepts/faq#differencies-between-cpu-and-gpu) | высокая |
| CatBoost | Основной артефакт - `cbm`; ONNX и CoreML - только для моделей без категориальных признаков (Y-LIB-009) | Экспорт в ONNX модели с категориальными, текстовыми или embedding-признаками; загрузка ONNX обратно в CatBoost; доверие к метке класса бинарного классификатора в onnxruntime | [ONNX: specifics](https://catboost.ai/docs/en/concepts/apply-onnx-ml#specifics), [save_model](https://catboost.ai/docs/en/concepts/python-reference_catboost_save_model) | высокая |
| CatBoost | Инференс из C и C++ - через библиотеку применения `libcatboostmodel`; C API и константные методы `TFullModel` потокобезопасны (Y-LIB-010) | Standalone evaluator: только float-признаки и зависимость от FlatBuffers | [evaluation library](https://catboost.ai/docs/en/concepts/c-plus-plus-api_dynamic-c-pluplus-wrapper), [standalone evaluator](https://catboost.ai/docs/en/concepts/c-plus-plus-api_header-only-evaluator), [C и C++](https://catboost.ai/docs/en/concepts/c-plus-plus-api) | высокая |
| CatBoost | Возобновлять обучение из снапшота в том же каталоге с теми же параметрами (Y-LIB-011) | Менять параметры или каталог при возобновлении | [snapshots](https://catboost.ai/docs/en/features/snapshots) | высокая |
| CatBoost | Сохранять и переиспользовать квантованный `Pool`, если нет категориальных признаков (Y-LIB-012) | Квантовать датасет заново при каждом запуске; переиспользовать квантованный пул с категориальными признаками | [speed-up-training](https://catboost.ai/docs/en/concepts/speed-up-training#reusing-quantized-datasets) | высокая |
| CatBoost | Пропуски в числовых признаках оставлять как `None` (Y-LIB-013); если объекты упорядочены по времени - `has_time` | Обязательная импутация пропусков перед обучением | [FAQ: пропуски](https://catboost.ai/docs/en/concepts/faq#preprocessing-of-missing-values), [parameter-tuning: порядок](https://catboost.ai/docs/en/concepts/parameter-tuning#internal-dataset-order) | высокая |
| CatBoost | Координаты эмбеддингов, если они нужны модели напрямую, добавлять ещё и как числовые признаки | Ждать, что `embedding_features` используют сами координаты: из них строятся производные признаки | [embeddings-features](https://catboost.ai/docs/en/features/embeddings-features) | высокая |
| YaFSDP | Актуальная точка входа - `fully_shard(module, mesh=..., mp_policy=...)`; шардировать модули с методом `forward` (Y-LIB-014) | Передавать `nn.ModuleList` или `nn.ModuleDict`; многомерный mesh | [fully_shard.py](https://github.com/yandex/YaFSDP/blob/HEAD/ya_fsdp/fully_shard.py) | средняя: по коду, документации нет |
| YaFSDP, API 2024 года | Явный список `modules_to_wrap_with_names`; явный `gradient_accumulation_steps`; отдельный класс слоя нормализации (Y-LIB-015) | Полагаться на `auto_wrap_policy`; считать README описанием текущего API | [migration_guide.md](https://github.com/yandex/YaFSDP/blob/HEAD/docs/migration_guide.md) | средняя: документ устарел |
| YaFSDP | Примеры из README запускать в Docker-образе репозитория с патченными `transformers` 4.39, `accelerate` 0.27, `trl` 0.8.3 (Y-LIB-016) | Запуск примеров с непатченными библиотеками | [README: examples](https://github.com/yandex/YaFSDP/blob/HEAD/README.md#examples) | высокая: только для примеров 2024 года |
| Yandex AI Studio SDK | Учётные данные - из окружения (`YC_API_KEY` и другие); в облаке - `MetadataAuth`, локально - `YandexCloudCLIAuth`, во внешней автоматизации - `APIKeyAuth` (Y-LIB-017); для долгих процессов - `EnvIAMTokenAuth` (Y-LIB-018) | Личный OAuth-токен в коде; статический IAM-токен дольше 12 часов | [документация SDK](https://aistudio.yandex.ru/ru/docs/ai-studio/sdk/), [_auth.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/src/yandex_ai_studio_sdk/_auth.py) | высокая |
| Yandex AI Studio SDK | Повторы настраивать через `retry_policy`, тайм-аут - аргументом метода (Y-LIB-019); долгие задачи - `run_deferred` и `wait` (Y-LIB-021) | Собственный цикл повторов поверх встроенного | [_retry.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/src/yandex_ai_studio_sdk/_retry.py) | средняя: по коду |
| Yandex AI Studio SDK | В asyncio-коде - `AsyncAIStudio` (Y-LIB-020); проверять статусы `TRUNCATED_FINAL` и `CONTENT_FILTER` (Y-LIB-021); пакет `yandex-ai-studio-sdk` (Y-LIB-022) | Импорт `yandex_cloud_ml_sdk` в новом коде; удалённые домены Assistants, Threads, Runs | [README](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/README.md), [MIGRATION.md](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/compat/yandex-cloud-ml-sdk/MIGRATION.md) | высокая |
| Проекты yandex-research | Один файл конфигурации на запуск, `report.json` рядом, сид в конфиге, оценка по нескольким сидам, `uv.lock`, раздел воспроизведения и BibTeX в README - см. Y-ML-004, Y-ML-009 - Y-ML-011, Y-REPRO-001, Y-REPRO-003, Y-REPRO-008 | В источниках не сформулированы | [tabm/paper/README.md](https://github.com/yandex-research/tabm/blob/main/paper/README.md), [tabpack README](https://github.com/yandex-research/tabpack/blob/HEAD/README.md) | средняя: практика 4-6 репозиториев из 12 |

### 2.2. Как Яндекс использует внешние библиотеки

Публичных правил Яндекса по работе с внешними ML-библиотеками нет: публичных данных не найдено. Известно только, какими библиотеками пользуются открытые проекты и продукты.

**PyTorch - основной фреймворк глубокого обучения по всем найденным свидетельствам.** Большие распределённые обучения в YTsaurus идут на сотнях джобов с PyTorch ([Хабр, 2025-12-25](https://habr.com/ru/companies/yandex/articles/979336/)). YaFSDP - не отдельный фреймворк, а замена FSDP внутри PyTorch: единственная зависимость пакета - `torch`, среди инструментов разработки есть линтер `torchfix` ([pyproject.toml](https://github.com/yandex/YaFSDP/blob/HEAD/pyproject.toml)). Все 12 просмотренных репозиториев `yandex-research` написаны на PyTorch; JAX и TensorFlow не используются ни в одном. По статье о YaFSDP, в предобучении моделей Яндекса библиотека вместе с другими оптимизациями памяти дала ускорение на 45 % ([Хабр, июнь 2024](https://habr.com/ru/companies/yandex/articles/817509/); не обновляется).

**Экосистема Hugging Face - формат публикации открытых моделей.** Примеры YaFSDP построены на `transformers`, `accelerate` и `trl` и требуют патчей к этим библиотекам. Карточки открытых моделей дают примеры на `transformers`, vLLM, SGLang, PEFT и `torchtune`; карточка [AliceAI-Foundation-80B-A3B-Base](https://huggingface.co/yandex/AliceAI-Foundation-80B-A3B-Base) указывает версии библиотек и для LoRA-дообучения требует FSDP2 из Accelerate; модель [AliceAI-T5-35B-A0.6B](https://huggingface.co/yandex/AliceAI-T5-35B-A0.6B) загружается только с `trust_remote_code=True`. Более ранняя YaLM 100B (2022) обучалась с DeepSpeed по примеру Megatron-LM ([yandex/YaLM-100B](https://github.com/yandex/YaLM-100B)).

**Инференс и обмен моделями.** Ноды DataSphere из модели работают на Triton Inference Server; для моделей вне списка поддерживаемых документация советует ONNX или Docker-образ ([DataSphere: Inference](https://yandex.cloud/ru/docs/datasphere/concepts/deploy/), 2026-06-24). Ресурс «модель» DataSphere сериализует CatBoost, TensorFlow и Keras, LightGBM, XGBoost, PyTorch и ONNX через библиотеку `serialzy` ([модели](https://yandex.cloud/ru/docs/datasphere/concepts/models/), 2025-04-30).

**Трекинг и подбор параметров.** MLflow рекомендован в туториалах Yandex Cloud для экспериментов и реестра ([туториал](https://yandex.cloud/ru/docs/tutorials/ml-ai/mlflow-datasphere), 2026-09-09). TensorBoard поддержан в CatBoost ([документация](https://catboost.ai/docs/en/features/visualization_tensorboard)) и используется в 6 из 12 репозиториев `yandex-research`. Optuna упомянута в документации CatBoost и входит в зависимости `tabpack`, `G2T-FM` и `graphpfn`. В Yandex AI Studio SDK есть интеграция с LangChain (метод `.langchain()`).

**Чего не найдено.** TensorFlow встречается только как формат модели в DataSphere; об использовании TensorFlow и JAX для обучения - публичных данных не найдено (просмотрены материалы 2024-2026 годов). Это наблюдение по просмотренным источникам, а не доказательство отсутствия. Стек обучения YandexGPT и Alice AI (фреймворк, распределённое обучение, трекер) публично описан только общими словами.

### 2.3. Внешние библиотеки: официальные рекомендации проектов (не Яндекс)

Все строки этой части - «не Яндекс»: это рекомендации самих проектов.

| Библиотека | Рекомендации | Антипаттерны | Источник | Уверенность |
|---|---|---|---|---|
| PyTorch | Сохранять `state_dict`; чекпойнт - словарь с состоянием модели, оптимизатора и номером шага; перед инференсом `model.eval()` (Y-LIB-023) | `torch.save(model, PATH)` целиком: файл привязан к классам и структуре каталогов | [serialization](https://docs.pytorch.org/docs/2.14/notes/serialization.html), [saving tutorial](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) | высокая |
| PyTorch | `torch.load` с `weights_only=True` (по умолчанию с версии 2.6); список разрешённых классов расширять только доверенными (Y-LIB-024) | `weights_only=False` для файлов из недоверенного источника | [serialization](https://docs.pytorch.org/docs/2.14/notes/serialization.html) | высокая |
| PyTorch | Сиды, `torch.use_deterministic_algorithms(True)`, генератор и `worker_init_fn` в `DataLoader` - см. Y-REPRO-001, Y-REPRO-002, Y-REPRO-005, Y-REPRO-006 в [reproducibility.md](reproducibility.md) | Ждать воспроизводимости между релизами, платформами, CPU и GPU | [randomness](https://docs.pytorch.org/docs/2.14/notes/randomness.html) | высокая |
| PyTorch | `torch.compile` и `torch.export`; распределённое обучение - `DistributedDataParallel` (Y-LIB-025) | `torch.jit.trace` и `torch.jit.script` в новом коде (объявлены устаревшими); `DataParallel` | [torch.compile tutorial](https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html), [tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) | высокая |
| PyTorch | AMP: `torch.autocast` только вокруг прямого прохода и функции потерь; состояние `GradScaler` сохранять в чекпойнт | `backward()` под `autocast`; `binary_cross_entropy` вместо варианта с логитами | [AMP recipe](https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html) | высокая |
| PyTorch | Создавать тензоры сразу на целевом устройстве; `torch.no_grad()` при валидации; отладочные средства выключать в обычных запусках | `.item()`, `.cpu()`, `print(tensor)` в горячем цикле; детектор аномалий и профайлер в регулярном обучении | [tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) | высокая |
| scikit-learn | Сначала разбиение на обучающую и тестовую части, потом препроцессинг: `fit_transform` на обучающей, `transform` на тестовой (Y-LIB-026) | `fit` на тестовых данных; отбор признаков на всех данных до разбиения | [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) | высокая |
| scikit-learn | Препроцессинг и модель объединять в `Pipeline`, особенно при кросс-валидации и подборе гиперпараметров (Y-LIB-027) | Преобразования, применённые при обучении и забытые на новых данных | [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) | высокая |
| scikit-learn | `random_state` передавать явно; в разбиения кросс-валидации - целое число - см. Y-REPRO-004 | Глобальный `np.random.seed`; сравнение моделей на разных разбиениях | [common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) | высокая |
| scikit-learn | Свой estimator: `__init__` только сохраняет параметры; `fit` возвращает `self`; выученные атрибуты оканчиваются на `_`; проверка `check_estimator` | Логика и валидация в `__init__` | [developing estimators](https://scikit-learn.org/stable/developers/develop.html) | высокая |
| Hugging Face | Веса хранить и загружать в формате safetensors (Y-LIB-028) | pickle-файлы весов из недоверенных источников | [safetensors](https://huggingface.co/docs/safetensors/index) | средняя: страница краткая |
| Hugging Face | Карточка модели - `README.md` с метаданными в YAML: `license`, `language`, `library_name`, `pipeline_tag`, `base_model`, `datasets`, `tags`; `library_name` задавать явно (Y-LIB-029) | Полагаться на автоопределение библиотеки | [model cards](https://huggingface.co/docs/hub/model-cards) | высокая |
| Hugging Face | Карточка датасета - `README.md` с метаданными (`license`, `language`, `task_categories`, `pretty_name`) и описанием возможных смещений | в источнике не названы | [dataset cards](https://huggingface.co/docs/hub/datasets-cards) | высокая |
| Hugging Face | Большие файлы в репозиториях Hub отслеживать через `git-xet`; CLI `hf` делает это сам | Коммитить файлы больше 10 МБ обычным git | [repositories](https://huggingface.co/docs/hub/repositories-getting-started) | высокая |
| Hugging Face Transformers | Единые `from_pretrained()`, `save_pretrained()`, `push_to_hub()`; код модели самодостаточен | Общие абстракции для поведения одной модели | [philosophy](https://huggingface.co/docs/transformers/philosophy) | высокая |
| MLflow | Каждый запуск - run с параметрами, метриками, артефактами и датасетами; модель логировать с `input_example` или явной сигнатурой; реестр - версии и алиасы (Y-MLOPS-013) | Запуски без трекинга; модель без сигнатуры | [tracking](https://mlflow.org/docs/latest/ml/tracking/), [signatures](https://mlflow.org/docs/latest/ml/model/signatures/), [model registry](https://mlflow.org/docs/latest/ml/model-registry/) | высокая |
| DVC | В git - файлы `.dvc` и `.gitignore`, данные - в удалённом хранилище (Y-MLOPS-003); пайплайн - `dvc.yaml` со стадиями (Y-MLOPS-006); параметры - в `params.yaml` | Коммитить сами данные; циклы в графе стадий; гиперпараметры в коде | [get started](https://doc.dvc.org/start), [defining pipelines](https://doc.dvc.org/user-guide/pipelines/defining-pipelines) | высокая |

В документации PyTorch есть внутреннее расхождение: руководство по производительности советует `torch.backends.cudnn.benchmark = True`, заметка о случайности - `False`. Для запусков, которые нужно повторять, профиль берёт `False` (правило Y-REPRO-005 в [reproducibility.md](reproducibility.md)).

## 3. CatBoost

Документация CatBoost - официальный гайд команды Яндекса. Ссылки ведут на catboost.ai; якоря сверены с исходниками документации в репозитории (HEAD от 2026-10-09).

### Y-LIB-001 · MUST · Не применять one-hot-кодирование к категориальным признакам до CatBoost; передавать их как есть через `cat_features`
- Проверка: частично: поиск `get_dummies` и `OneHotEncoder` в коде, который готовит данные для CatBoost; остальное - ручное ревью.
- Источник: [CatBoost: parameter tuning, one-hot encoding](https://catboost.ai/docs/en/concepts/parameter-tuning#one-hot-enc) (CatBoost 1.2.10, документация на 2026-10-09) · официальный гайд · высокая.
- Пример:

```python
# плохо
X = pd.get_dummies(df[features])
model = CatBoostClassifier().fit(X, y)

# хорошо
model = CatBoostClassifier(cat_features=["city", "device"])
model.fit(df[features], y)
```

По документации, внешнее one-hot-кодирование ухудшает и скорость обучения, и качество. Если one-hot всё же нужен, его включают встроенным параметром `one_hot_max_size`.

### Y-LIB-002 · MUST · Значения категориальных признаков передавать строками или целыми числами, а не float и не NaN
- Проверка: тест данных на dtype категориальных столбцов (Y-ML-015); при обучении из матрицы CatBoost сам завершится ошибкой.
- Источник: [CatBoost FAQ: float и NaN в категориальных признаках](https://catboost.ai/docs/en/concepts/faq#why-float-and-nan-values-are-forbidden-for-cat-features) (CatBoost 1.2.10) · официальный гайд · высокая.
- Пример:

```python
# плохо: столбец float64 с NaN
df["segment"] = df["segment_id"]

# хорошо: пропуск заменён явной категорией, целые приведены к строкам
df["segment"] = df["segment_id"].fillna(-1).astype(int).astype(str)
```

CatBoost хеширует строковое представление значения. `1.0` и `1`, `None` и `N/A` дают разные хеши, и модель, обученная из матрицы, разойдётся с применением из файла.

### Y-LIB-003 · SHOULD · Категориальные столбцы pandas хранить в типе `Categorical`, а не `object`
- Проверка: тест данных на dtype; ручное ревью.
- Источник: [CatBoost: speeding up the training](https://catboost.ai/docs/en/concepts/speed-up-training#pandas-instead-of-objects) (CatBoost 1.2.10) · официальный гайд · высокая.

Документация обещает ускорение препроцессинга до 200 раз. Значения категорий при этом должны оставаться строками или целыми (Y-LIB-002).

### Y-LIB-004 · SHOULD · Число итераций подбирать по валидационному набору: большое `iterations`, детектор переобучения и `use_best_model`; делать это до настройки остальных параметров
- Проверка: ручное ревью: в вызове `fit` есть `eval_set`, в параметрах - детектор переобучения.
- Источник: [CatBoost: parameter tuning, number of trees](https://catboost.ai/docs/en/concepts/parameter-tuning#trees-number); [overfitting detector](https://catboost.ai/docs/en/concepts/overfitting-detector) (CatBoost 1.2.10) · официальный гайд · высокая.
- Пример:

```python
model = CatBoostClassifier(
    iterations=5000,        # заведомо с запасом
    eval_metric="AUC",      # функция потерь остаётся Logloss
    od_type="Iter",
    od_wait=100,
    use_best_model=True,
)
model.fit(train_pool, eval_set=valid_pool)
```

Метрика выбора лучшей итерации (`eval_metric`) может отличаться от функции потерь. Параметр `od_pval` относится только к детектору `IncToDec`: с типом `Iter` его не задают.

### Y-LIB-005 · MUST · По результатам функции `cv` выбирать только число итераций; гиперпараметры ею не подбирать
- Проверка: ручное ревью.
- Источник: [CatBoost FAQ: cv](https://catboost.ai/docs/en/concepts/faq#how-to-get-best-parameters-from-the-cv-function) (CatBoost 1.2.10) · официальный гайд · высокая.

`cv` не возвращает обученную модель и не перебирает параметры. Для перебора есть `grid_search` и `randomized_search`; в документации также приведён пример с Optuna.

### Y-LIB-006 · SHOULD · Начинать с глубины деревьев 6-10 и автоматического learning rate; менять их по признакам недо- и переобучения
- Проверка: ручное ревью конфигов.
- Источник: [CatBoost: parameter tuning, tree depth](https://catboost.ai/docs/en/concepts/parameter-tuning#tree-depth); [learning rate](https://catboost.ai/docs/en/concepts/parameter-tuning#learning-rate) (CatBoost 1.2.10) · официальный гайд · высокая.

Если на последних итерациях переобучения нет - learning rate увеличивают, если есть - уменьшают. FAQ называет глубину 6 рекомендуемой и советует уменьшать глубину при нехватке памяти.

### Y-LIB-007 · SHOULD · Число границ квантования поднимать до 1024 только для одного-двух самых сильных признаков
- Проверка: ручное ревью конфигов.
- Источник: [CatBoost: parameter tuning, golden features](https://catboost.ai/docs/en/concepts/parameter-tuning#golden-features) (CatBoost 1.2.10) · официальный гайд · высокая.

### Y-LIB-008 · SHOULD · Фиксировать `random_seed` в конфиге и записывать в отчёт `task_type`: обучение на GPU недетерминировано
- Проверка: частично: наличие `random_seed` и `task_type` в конфиге и `report.json`; остальное - ручное ревью.
- Источник: [CatBoost: training on GPU](https://catboost.ai/docs/en/features/training-on-gpu); [FAQ: CPU и GPU](https://catboost.ai/docs/en/concepts/faq#differencies-between-cpu-and-gpu) (CatBoost 1.2.10) · официальный гайд · высокая для факта, средняя для правила · реконструкция.

Документация объясняет недетерминированность GPU порядком суммирования чисел с плавающей точкой. Значения по умолчанию на CPU и GPU различаются (`border_count` - 254 против 128, `bootstrap_type`, `boosting_type`), поэтому модели с одинаковым конфигом на разных устройствах сравнивать нельзя. Вывод «для побитовой повторяемости нужен CPU и фиксированный сид» сделан авторами профиля: прямо документация говорит только о GPU. Общие правила - в [reproducibility.md](reproducibility.md): сид в конфиге (Y-REPRO-001), сравнение запусков с допуском (Y-REPRO-006), явные значения параметров, зависящих от устройства (Y-REPRO-007).

### Y-LIB-009 · MUST · Основным артефактом модели считать файл `cbm`; в ONNX и CoreML экспортировать только модели без категориальных признаков
- Проверка: тест экспорта в CI; тест паритета предсказаний (Y-MLOPS-023).
- Источник: [CatBoost: ONNX, Specifics](https://catboost.ai/docs/en/concepts/apply-onnx-ml#specifics); [save_model](https://catboost.ai/docs/en/concepts/python-reference_catboost_save_model) (CatBoost 1.2.10) · официальный гайд · высокая.
- Пример:

```python
model.save_model("model.cbm")                   # основной артефакт
model.save_model("model.onnx", format="onnx")   # только без категориальных признаков
```

Ограничения ONNX по документации: только числовые признаки; экспортированную модель нельзя загрузить обратно в CatBoost; метку класса бинарного классификатора в onnxruntime нужно игнорировать. Явного обещания совместимости формата `cbm` между версиями CatBoost в документации не найдено; рекомендация профиля - записывать версию библиотеки рядом с моделью.

### Y-LIB-010 · SHOULD · Из C и C++ применять модель через библиотеку применения `libcatboostmodel`; standalone evaluator не использовать
- Проверка: ручное ревью зависимостей сборки.
- Источник: [CatBoost: evaluation library](https://catboost.ai/docs/en/concepts/c-plus-plus-api_dynamic-c-pluplus-wrapper); [standalone evaluator](https://catboost.ai/docs/en/concepts/c-plus-plus-api_header-only-evaluator); [C и C++](https://catboost.ai/docs/en/concepts/c-plus-plus-api) (CatBoost 1.2.10) · официальный гайд · высокая.
- Пример:

```cpp
ModelCalcerWrapper calcer("model.cbm");
std::vector<float> floatFeatures(100);
std::vector<std::string> catFeatures = {"one", "two", "three"};
std::cout << calcer.Calc(floatFeatures, catFeatures) << std::endl;
```

Документация называет библиотеку применения самым быстрым способом, а standalone evaluator - нерекомендуемым из-за ограничений: он поддерживает только float-признаки и зависит от FlatBuffers. C API и константные методы `TFullModel` потокобезопасны: один загруженный объект модели можно читать из нескольких потоков. Обёртка C++ требует C++11 или новее. Выделение кода применения в отдельную библиотеку - Y-ML-017.

### Y-LIB-011 · MUST · Прерванное обучение возобновлять из снапшота в том же каталоге и с теми же параметрами
- Проверка: ручное ревью скрипта запуска.
- Источник: [CatBoost: recovering training after an interruption](https://catboost.ai/docs/en/features/snapshots) (CatBoost 1.2.10) · официальный гайд · высокая.

Уровень MUST - это условие работы механизма. В исходниках документации, в блоке для внутренней аудитории, который на сайте не показан, сказано, что снапшоты CPU и GPU имеют разный формат; уверенность в этом низкая, но менять тип устройства при возобновлении не стоит. Общий принцип продолжения запусков - Y-REPRO-015.

### Y-LIB-012 · SHOULD · Квантованный `Pool` сохранять и переиспользовать между запусками, если в датасете нет категориальных признаков
- Проверка: ручное ревью.
- Источник: [CatBoost: reusing quantized datasets](https://catboost.ai/docs/en/concepts/speed-up-training#reusing-quantized-datasets) (CatBoost 1.2.10) · официальный гайд · высокая.

`Pool.quantize()`, затем `Pool.save(path)` и `Pool(data="quantized://" + path)`. Сохранённый пул - артефакт, а не исходник: в git он не попадает (Y-MLOPS-001).

### Y-LIB-013 · SHOULD · Пропуски в числовых признаках не заполнять заранее: обозначать их `None` и оставлять обработку CatBoost
- Проверка: ручное ревью.
- Источник: [CatBoost FAQ: missing values](https://catboost.ai/docs/en/concepts/faq#preprocessing-of-missing-values) (CatBoost 1.2.10) · официальный гайд · высокая.

Правило относится к числовым признакам. В категориальных признаках `None` и NaN запрещены (Y-LIB-002).

## 4. YaFSDP

**Факты.** YaFSDP - библиотека шардирования параметров для распределённого обучения трансформеров поверх PyTorch; README заявляет ускорение до 20 % относительно FSDP при предобучении LLM. Репозиторий выгружается из монорепозитория Яндекса: в корне лежат `.piglet-meta.json` и `.mapping.json`. Код активен (82 коммита, последний - 2026-10-05), но README, migration guide и примеры описывают API 2024 года - класс `YaFSDP(...)`. Пакет с 2025-01-28 (коммит «YaFSDP2 release») экспортирует `fully_shard`, `MixedPrecisionPolicy`, `YaFSDPModule`, `UnshardHandle`, `RaggedShard`; старый класс остаётся в `ya_fsdp/ya_fsdp.py` и исключён из проверок ruff и mypy. Релизных тегов и GitHub Actions в репозитории нет; зависимость `torch` в `pyproject.toml` не ограничена по версии; каталога тестов нет. Модуль `_collectives.py` опционально импортирует библиотеку `yccl`, которой нет в зависимостях пакета.

**Конфликт источников.** Документация и код расходятся. Профиль описывает интеграцию по коду (`fully_shard`), а сведения из migration guide помечает как устаревший API. Причина: пакет экспортирует только новый API, а старые файлы исключены из собственных проверок проекта.

**Чего нет.** Публичных данных не найдено: список поддерживаемых версий PyTorch и `transformers` для YaFSDP2; документация на `fully_shard`.

### Y-LIB-014 · MUST · Шардировать модель функцией `fully_shard`: передавать модуль с методом `forward` и одномерный mesh
- Проверка: ошибка времени выполнения (`ValueError`); ручное ревью.
- Источник: [YaFSDP: ya_fsdp/fully_shard.py](https://github.com/yandex/YaFSDP/blob/HEAD/ya_fsdp/fully_shard.py) (HEAD от 2026-10-05) · конфиг или инструмент · средняя.
- Пример:

```python
from ya_fsdp import fully_shard

# плохо: контейнер без forward - ValueError
fully_shard(model.layers)            # nn.ModuleList

# хорошо: модули с методом forward
for block in model.layers:
    fully_shard(block)
```

Уровень MUST, потому что нарушение останавливает программу. Сигнатура: `fully_shard(module, *, mesh=None, reshard_after_forward=True, mp_policy=MixedPrecisionPolicy(), ignored_params=None, shard_alignment=8)`.

Порядок вызовов для модели целиком в публичных источниках не описан: примеров использования `fully_shard` в репозитории нет, сверяйтесь с кодом. Шардированный модуль нельзя копировать через `copy.deepcopy` - код завершится ошибкой и отправит к сериализации через `state_dict`.

### Y-LIB-015 · SHOULD · README и migration guide YaFSDP считать описанием устаревшего API; сверяться с кодом и закреплять зависимость по хешу коммита
- Проверка: ручное ревью; в файле зависимостей - ссылка на git с хешем коммита.
- Источник: [YaFSDP: docs/migration_guide.md](https://github.com/yandex/YaFSDP/blob/HEAD/docs/migration_guide.md) (2024-08-19, не обновляется) · официальный гайд · средняя; [ya_fsdp/__init__.py](https://github.com/yandex/YaFSDP/blob/HEAD/ya_fsdp/__init__.py) (HEAD от 2026-10-05) · конфиг или инструмент · средняя · реконструкция.

В API 2024 года вместо `auto_wrap_policy` задаются явный список шардируемых модулей `modules_to_wrap_with_names`, слои нормализации и обязательное число шагов накопления градиента. Закрепление по хешу - вывод авторов профиля из того, что тегов в репозитории нет, а API уже менялся без смены документации.

### Y-LIB-016 · MUST · Примеры YaFSDP из README запускать в Docker-образе репозитория с патченными библиотеками
- Проверка: ручное ревью.
- Источник: [YaFSDP README: Examples](https://github.com/yandex/YaFSDP/blob/HEAD/README.md#examples) (2024-08-19, не обновляется); [docker/Dockerfile](https://github.com/yandex/YaFSDP/blob/HEAD/docker/Dockerfile) (2024-05-27) · официальный гайд · высокая для примеров 2024 года.

README прямо говорит, что оба примера требуют образ; он собирается на базе NVIDIA PyTorch 24.02 с `transformers` v4.39, `accelerate` v0.27.0 и `trl` v0.8.3, патчи лежат в каталоге `patches/`. Примеры относятся к старому API (Y-LIB-015).

## 5. Yandex AI Studio SDK

**Факты.** Актуальное имя репозитория и пакета - `yandex-ai-studio-sdk`; переименование из `yandex-cloud-ml-sdk` произошло 2026-01-27, класс `YCloudML` стал `AIStudio`. SDK асинхронный в ядре: каждый сервис доступен в синхронном и асинхронном варианте, синхронные методы - обёртка, которая выполняет корутины в фоновом потоке. На странице документации SDK нет разделов о повторах, тайм-аутах и логировании: эти сведения взяты из кода, поэтому уверенность в них средняя.

### Y-LIB-017 · SHOULD · Учётные данные в код не записывать: оставлять `auth` пустым, чтобы SDK взял их из окружения, либо явно выбирать способ под среду запуска
- Проверка: частично: сканер секретов (Y-MLOPS-005); остальное - ручное ревью.
- Источник: [документация SDK](https://aistudio.yandex.ru/ru/docs/ai-studio/sdk/) (проверено 2026-10-09) · официальный гайд · высокая; [_auth.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/src/yandex_ai_studio_sdk/_auth.py) (v0.22.1) · конфиг или инструмент · высокая.
- Пример:

```python
# плохо: личный OAuth-токен в коде сервиса
sdk = AIStudio(folder_id="<FOLDER_ID>", auth="<OAUTH_TOKEN>")

# хорошо: внутри Yandex Cloud
from yandex_ai_studio_sdk.auth import MetadataAuth

sdk = AIStudio(auth=MetadataAuth())
```

Без `auth` SDK по порядку проверяет `YC_API_KEY`, `YC_IAM_TOKEN`, `YC_OAUTH_TOKEN`, метаданные ВМ, `YC_TOKEN` и профиль Yandex Cloud CLI; каталог берётся из `YC_FOLDER_ID`. Предупреждение в коде SDK советует `YandexCloudCLIAuth` для личной работы, `MetadataAuth` внутри инфраструктуры Yandex Cloud и `APIKeyAuth` для внешней автоматизации; передавать кому-либо личный OAuth-токен оно называет небезопасным.

### Y-LIB-018 · MUST · В долгоживущих процессах не использовать статический IAM-токен: он живёт не более 12 часов
- Проверка: ручное ревью.
- Источник: [документация SDK](https://aistudio.yandex.ru/ru/docs/ai-studio/sdk/) (проверено 2026-10-09) · официальный гайд · высокая.

Уровень MUST - это ограничение сервиса. Для `YC_TOKEN` и `EnvIAMTokenAuth` SDK заново читает токен из переменной окружения при каждом запросе, поэтому токен можно обновлять снаружи; для сервисного агента DataSphere документация называет `EnvIAMTokenAuth` оптимальным вариантом. Комментарий в коде SDK не рекомендует переменную `YC_TOKEN` для личного рабочего окружения: она оставлена для совместимости с DataSphere.

### Y-LIB-019 · SHOULD · Повторы настраивать параметром `retry_policy`, тайм-аут - аргументом метода; собственный цикл повторов поверх встроенного не строить
- Проверка: ручное ревью.
- Источник: [_retry.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/src/yandex_ai_studio_sdk/_retry.py) (v0.22.1) · конфиг или инструмент · средняя · реконструкция.

`RetryPolicy` по умолчанию делает до 5 попыток с начальной задержкой 1 с, множителем 1,5 и потолком 10 с и повторяет коды gRPC `UNAVAILABLE` и `RESOURCE_EXHAUSTED`; при повторах SDK сам добавляет ключ идемпотентности. `NoRetryPolicy` отключает повторы. Внешний цикл умножил бы число попыток.

### Y-LIB-020 · SHOULD · В asyncio-коде использовать `AsyncAIStudio`, в скриптах - `AIStudio`
- Проверка: ручное ревью.
- Источник: [README](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/README.md); [_utils/sync.py](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/src/yandex_ai_studio_sdk/_utils/sync.py) (v0.22.1) · конфиг или инструмент · средняя · реконструкция.

Синхронный вызов блокирует текущий поток, пока корутина выполняется в фоновом цикле событий. Внутри собственного цикла событий это остановит остальные задачи.

### Y-LIB-021 · SHOULD · Статусы ответа `TRUNCATED_FINAL` и `CONTENT_FILTER` обрабатывать отдельно от успешного; долгие операции запускать через `run_deferred` и ждать результата методом `wait`
- Проверка: ручное ревью; тест на обработку каждого статуса.
- Источник: [документация SDK](https://aistudio.yandex.ru/ru/docs/ai-studio/sdk/) (проверено 2026-10-09) · официальный гайд · высокая; [примеры completions](https://github.com/yandex-cloud/yandex-ai-studio-sdk/tree/master/examples/sync/completions) (v0.22.1) · конфиг или инструмент · высокая.

### Y-LIB-022 · SHOULD · В новом коде ставить пакет `yandex-ai-studio-sdk` и импортировать `yandex_ai_studio_sdk`; удалённые домены Assistants, Threads и Runs не использовать
- Проверка: поиск `yandex_cloud_ml_sdk` и `YCloudML` в коде и зависимостях.
- Источник: [MIGRATION.md](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/compat/yandex-cloud-ml-sdk/MIGRATION.md); [README](https://github.com/yandex-cloud/yandex-ai-studio-sdk/blob/master/README.md) (v0.22.1) · официальный гайд · высокая.

`yandex-cloud-ml-sdk` 0.19.0 - только обёртка совместимости; новые версии выходят под новым именем начиная с 0.19.0. Домены Assistants, Threads, Runs и Messages удалены из SDK в июле 2026 года; README даёт руководство по переходу на Responses API.

## 6. Проекты yandex-research

Соглашения исследовательских репозиториев описаны в соседних документах: раскладка и конфиги - [project-structure.md](project-structure.md) (Y-ML-001 - Y-ML-011), ноутбуки - [notebooks.md](notebooks.md), сиды и окружение - [reproducibility.md](reproducibility.md). К библиотекам относится одно наблюдение: все 12 просмотренных репозиториев используют PyTorch, в шести сид выставляется вызовом `delu.random.seed(config['seed'])`, а в трёх (tabpack, G2T-FM, graphpfn) в зависимостях есть Optuna. Это практика исследовательских групп, а не правила; требования к такому коду мягче, чем к библиотекам.

## 7. Внешние библиотеки (не Яндекс)

Правила ниже взяты из официальных руководств самих проектов. У Яндекса правил для этих библиотек нет: публичных данных не найдено.

### Y-LIB-023 · SHOULD · В PyTorch сохранять `state_dict`, а не объект модели целиком; чекпойнт - словарь с состоянием модели, оптимизатора и номером шага (не Яндекс)
- Проверка: частично: поиск `torch.save(model` в коде; остальное - ручное ревью.
- Источник: [PyTorch: serialization semantics](https://docs.pytorch.org/docs/2.14/notes/serialization.html) (PyTorch 2.14); [saving and loading models](https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html) (2025-06-26) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
# плохо: файл привязан к классу и структуре каталогов
torch.save(model, "model.pt")

# хорошо
torch.save(
    {"model": model.state_dict(), "optimizer": optimizer.state_dict(), "step": step},
    "checkpoint.pt",
)
```

### Y-LIB-024 · SHOULD · Загружать чекпойнты PyTorch с `weights_only=True`; не снимать ограничение для файлов из недоверенных источников (не Яндекс)
- Проверка: поиск `weights_only=False` в коде; ручное ревью каждого случая.
- Источник: [PyTorch: serialization semantics](https://docs.pytorch.org/docs/2.14/notes/serialization.html) (PyTorch 2.14) · официальный гайд · высокая · не Яндекс.

С версии 2.6 `weights_only=True` - значение по умолчанию. Список разрешённых классов расширяют через `torch.serialization.add_safe_globals` только для своих классов.

### Y-LIB-025 · SHOULD · В новом коде PyTorch не использовать `torch.jit.trace`, `torch.jit.script` и `DataParallel`; вместо них - `torch.compile` или `torch.export` и `DistributedDataParallel` (не Яндекс)
- Проверка: поиск устаревших вызовов в коде.
- Источник: [PyTorch: torch.compile tutorial](https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html) (2026-04-01); [performance tuning guide](https://docs.pytorch.org/tutorials/recipes/recipes/tuning_guide.html) (2025-07-09) · официальный гайд · высокая · не Яндекс.

### Y-LIB-026 · MUST · В scikit-learn не вызывать `fit` на тестовых данных: сначала разбиение, затем препроцессинг (не Яндекс)
- Проверка: ручное ревью; частично: препроцессинг только внутри `Pipeline` (Y-LIB-027).
- Источник: [scikit-learn: common pitfalls, data leakage](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn 1.9.1) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
# плохо: масштабирование видит тестовые данные
X = StandardScaler().fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

# хорошо
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
scaler = StandardScaler().fit(X_train)
X_train, X_test = scaler.transform(X_train), scaler.transform(X_test)
```

Уровень MUST взят из формулировки источника: общее правило там дано со словом «never».

### Y-LIB-027 · SHOULD · Препроцессинг и модель scikit-learn объединять в `Pipeline`, особенно при кросс-валидации и подборе гиперпараметров (не Яндекс)
- Проверка: ручное ревью.
- Источник: [scikit-learn: common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html) (scikit-learn 1.9.1) · официальный гайд · высокая · не Яндекс.

`Pipeline` применяет одни и те же преобразования при обучении и на новых данных и не даёт отбору признаков увидеть тестовую часть. Для CatBoost внутри `GridSearchCV` категориальные признаки задают параметром `cat_features` в конструкторе модели ([CatBoost FAQ](https://catboost.ai/docs/en/concepts/faq#grid-search-random-search-cv)).

### Y-LIB-028 · SHOULD · Веса моделей публиковать и загружать в формате safetensors, а не pickle (не Яндекс)
- Проверка: частично: поиск файлов `*.bin` и `*.pkl` среди публикуемых весов; остальное - ручное ревью.
- Источник: [Hugging Face: safetensors](https://huggingface.co/docs/safetensors/index) (проверено 2026-10-09) · официальный гайд · средняя · не Яндекс.

Уверенность средняя, потому что страница источника краткая. Если модель требует `trust_remote_code=True`, как AliceAI-T5-35B-A0.6B, при загрузке выполняется код пользовательской архитектуры из репозитория модели; рекомендация профиля - прочитать его до запуска. Письменной рекомендации Hugging Face о закреплении ревизии модели в просмотренных источниках не найдено.

### Y-LIB-029 · SHOULD · Карточку модели на Hugging Face Hub оформлять как `README.md` с метаданными в YAML и явно указывать `library_name` (не Яндекс)
- Проверка: ручное ревью; наличие блока метаданных в начале `README.md`.
- Источник: [Hugging Face Hub: model cards](https://huggingface.co/docs/hub/model-cards) (проверено 2026-10-09) · официальный гайд · высокая · не Яндекс.

Содержание карточки - в Y-MLOPS-018 и шаблоне [MODEL_CARD.md](../../templates/ml/MODEL_CARD.md).

## 8. Чего нет

Публичных данных не найдено:

- правила Яндекса по работе с PyTorch, Hugging Face, ONNX, Triton, scikit-learn;
- поддерживаемые версии PyTorch для YaFSDP2 и документация на `fully_shard`;
- обещание совместимости формата `cbm` между версиями CatBoost;
- рекомендации CatBoost о раздельном хранении кода обучения и кода применения, о тестах моделей и о мониторинге;
- разделы о повторах, тайм-аутах и логировании в документации Yandex AI Studio SDK (сведения есть только в коде);
- подробное описание стека обучения YandexGPT и Alice AI.
