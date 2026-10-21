# FastAPI - профиль Яндекса

> Данные актуальны на 2026-10-09.

Публичных правил Яндекса по FastAPI и эталонных открытых проектов на нём - публичных данных не найдено. Единственный найденный код - учебный пример деплоя в Yandex DataSphere из одного файла. Профиль состоит из общих Python-правил ([`../languages/python.md`](../languages/python.md)) и четырнадцати общепринятых правил с пометкой «не Яндекс»: официальная документация FastAPI, правила `FAST` линтера ruff, официальный шаблон full-stack-fastapi-template и сторонний сборник fastapi-best-practices. Отсутствие FastAPI в открытом коде не означает, что его не используют внутри компании: это отсутствие публичных данных.

## Что публично есть у Яндекса

| Источник | Что это | Статус | Годится как источник правил |
|---|---|---|---|
| [yandex-cloud-examples/yc-datasphere-fastapi-service-deploy](https://github.com/yandex-cloud-examples/yc-datasphere-fastapi-service-deploy/blob/ff4ef1182d5c44312fe0cfbfddb76285a38e1280/main.py) | один `main.py` с тремя синхронными эндпоинтами без аннотаций и моделей Pydantic | пример деплоя, 2025-06-05, Apache-2.0 | нет: это иллюстрация к платформе, а не образец кода |
| [datalens-backend](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/metapkg/pyproject.toml) | крупнейший открытый Python-бэкенд Яндекса; построен на aiohttp и Flask, импортов `fastapi` в репозитории нет | активен, 2026-09-30 | нет (другой фреймворк) |
| [«Как в компании развивался Python»](https://habr.com/ru/companies/yandex/articles/509352/) (А. Кошелев, Habr, 2020-07-15) | перечисляет Django, Flask, Falcon, Tornado, Twisted и asyncio; FastAPI не упоминает | архивная статья | нет |

Репозиториев `yc-serverless-fastapi` и `yc-serverless-containers-fastapi` в организациях Яндекса на GitHub нет (проверено 2026-10-09).

## Как совмещать с Python-профилем

FastAPI-код подчиняется правилам `Y-PY-*` и общему конфигу. FastAPI опирается на аннотации типов, поэтому с Y-PY-031 (полные аннотации) конфликта нет. Два места требуют внимания:

- **Вызовы в значениях по умолчанию.** Набор flake8-bugbear из профиля (Y-PY-038) запрещает вызов функции в значении аргумента по умолчанию (`B008`), а классическая запись зависимостей FastAPI - именно `db: Session = Depends(get_db)`. Сам FastAPI и его шаблон отключают `B008`. Профиль решает иначе: зависимости объявляют через `Annotated` (Y-FAPI-005), и `B008` остаётся включённым.
- **Версия Python.** FastAPI 0.143.0 требует Python ≥3.10 - это совпадает с базой профиля (Y-PY-046). Официальный шаблон требует ≥3.14; профиль это значение не перенимает.

## Правила «не Яндекс»: официальная документация FastAPI

Отдельной страницы «FastAPI style guide» не существует: правила собраны из учебника и справочных разделов документации (версия 0.143.0, 2026-10-08; лицензия MIT). Почти все формулировки рекомендательные, поэтому уровень - SHOULD; MUST стоит там, где документация пишет «never» или нарушение даёт ошибку.

### Y-FAPI-001 · SHOULD · Обработчик объявляют через `async def` только тогда, когда внутри вызываются библиотеки через `await`; для блокирующих библиотек и в случае сомнений пишут обычный `def`
- Проверка: частично: `ruff ASYNC210`, `ASYNC230`, `ASYNC251` находят блокирующие HTTP-вызовы, `open()` и `time.sleep` внутри `async def` (группа `ASYNC` по желанию); остальное - ручное ревью.
- Источник: [FastAPI, Concurrency and async / await - In a hurry?](https://fastapi.tiangolo.com/async/#in-a-hurry) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
# плохо: блокирующий вызов останавливает цикл событий
@router.get("/report")
async def get_report() -> Report:
    response = requests.get(REPORT_URL, timeout=5)
    return Report.model_validate(response.json())

# хорошо: блокирующая библиотека - обычный def, FastAPI выполнит его в пуле потоков
@router.get("/report")
def get_report() -> Report:
    response = requests.get(REPORT_URL, timeout=5)
    return Report.model_validate(response.json())
```

### Y-FAPI-002 · SHOULD · Приложение оформляют пакетом `app/` с `main.py`, `dependencies.py` и подпакетами `routers/` и `internal/`; в каждом каталоге есть `__init__.py`
- Проверка: ручное ревью.
- Источник: [FastAPI, Bigger Applications - An example file structure](https://fastapi.tiangolo.com/tutorial/bigger-applications/#an-example-file-structure) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.

### Y-FAPI-003 · SHOULD · Маршруты группируют по модулям: один `APIRouter` на модуль, общие `prefix`, `tags`, `dependencies` и `responses` задают на роутере или при `include_router`, а не на каждом маршруте
- Проверка: ручное ревью.
- Источник: [FastAPI, Bigger Applications - APIRouter](https://fastapi.tiangolo.com/tutorial/bigger-applications/#apirouter) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.

### Y-FAPI-004 · SHOULD · `main.py` остаётся тонким: создаёт `FastAPI()` и подключает роутеры, импортируя модули (`from .routers import items, users`), а не переменные `router`
- Проверка: ручное ревью.
- Источник: [FastAPI, Bigger Applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.

### Y-FAPI-005 · SHOULD · Параметры запроса и зависимости объявляют через `Annotated`, а не через значение по умолчанию
- Проверка: `ruff FAST002`.
- Источник: [FastAPI, Query Parameters and String Validations](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
# плохо
@router.get("/items")
def list_items(db: Session = Depends(get_db), limit: int = Query(default=20, le=100)) -> list[Item]: ...

# хорошо
@router.get("/items")
def list_items(
    db: Annotated[Session, Depends(get_db)],
    limit: Annotated[int, Query(le=100)] = 20,
) -> list[Item]: ...
```

### Y-FAPI-006 · SHOULD · Тип ответа задают аннотацией возвращаемого значения; `response_model` указывают, только когда возвращаемый объект отличается от объявленной схемы
- Проверка: `ruff FAST001` (лишний `response_model`).
- Источник: [FastAPI, Response Model - `response_model` or Return Type](https://fastapi.tiangolo.com/tutorial/response-model/#response-model-or-return-type) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс. Если объявлены и аннотация, и `response_model`, FastAPI использует `response_model`.

### Y-FAPI-007 · MUST · Для входа и выхода используют разные модели; пароль и другие секреты в ответ не попадают
- Проверка: ручное ревью.
- Источник: [FastAPI, Response Model - Add an output model](https://fastapi.tiangolo.com/tutorial/response-model/#add-an-output-model) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс. MUST, потому что предупреждение о пароле в предыдущем разделе той же страницы начинается со слова «Never».

### Y-FAPI-008 · MUST · Каждый параметр пути из шаблона маршрута присутствует в сигнатуре обработчика
- Проверка: `ruff FAST003`.
- Источник: [ruff, правила FastAPI (FAST)](https://docs.astral.sh/ruff/rules/#fastapi-fast) (правило стабильно с ruff 0.10.0; проверено на 0.16.8) · конфиг или инструмент · высокая · не Яндекс. MUST, потому что нарушение - ошибка логики, а не стиля.

### Y-FAPI-009 · SHOULD · Действия при запуске и остановке описывают через `lifespan`, а не через устаревший `@app.on_event`
- Проверка: ручное ревью.
- Источник: [FastAPI, Lifespan Events](https://fastapi.tiangolo.com/advanced/events/#lifespan) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.

### Y-FAPI-010 · SHOULD · Настройки описывают классом `BaseSettings` из `pydantic-settings`, отдают зависимостью и создают один раз через `@lru_cache`
- Проверка: ручное ревью.
- Источник: [FastAPI, Settings and Environment Variables - Pydantic Settings](https://fastapi.tiangolo.com/advanced/settings/#pydantic-settings) и [Creating the Settings only once with lru_cache](https://fastapi.tiangolo.com/advanced/settings/#creating-the-settings-only-once-with-lru-cache) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс.
- Пример:

```python
class Settings(BaseSettings):
    database_url: str
    request_timeout: float = 5.0


@lru_cache
def get_settings() -> Settings:
    return Settings()


SettingsDep = Annotated[Settings, Depends(get_settings)]
```

### Y-FAPI-011 · SHOULD · Обработчики тестируют через `TestClient` в pytest обычными функциями `def`; асинхронный клиент нужен, только если тест сам вызывает `async`-код
- Проверка: ручное ревью.
- Источник: [FastAPI, Testing](https://fastapi.tiangolo.com/tutorial/testing/) и [Async Tests](https://fastapi.tiangolo.com/advanced/async-tests/) (0.143.0, 2026-10-08) · официальный гайд · высокая · не Яндекс. Согласуется с Y-PY-040 и Y-PY-042.

### Y-FAPI-012 · SHOULD · Внутри пакета приложения модули импортируют относительно (`from .routers import items`, `from ..dependencies import get_token`)
- Проверка: ручное ревью.
- Источник: [FastAPI, Bigger Applications - How relative imports work](https://fastapi.tiangolo.com/tutorial/bigger-applications/#how-relative-imports-work) (0.143.0, 2026-10-08; в документации это пример, а не требование) · официальный гайд · средняя · не Яндекс. Согласуется с Y-PY-012; импорт из родительского пакета (`..`) несовместим с необязательным `ruff TID252`.

## Правила «не Яндекс»: структура крупного сервиса и линтер

### Y-FAPI-013 · SHOULD · Крупный сервис раскладывают по доменам: `src/<домен>/` с модулями `router.py`, `schemas.py`, `models.py`, `service.py`, `dependencies.py`
- Проверка: ручное ревью.
- Источник: [zhanymkanov/fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices) (последний коммит 2026-05-03; файла LICENSE в репозитории нет, поэтому только пересказ) · сторонний источник · средняя · не Яндекс.

Y-FAPI-013 - альтернатива Y-FAPI-002 для сервисов, где раскладка «по типу файла» перестаёт помещаться в один пакет; выбирают одну схему на проект. Из того же сборника полезно знать: проверки, зависящие от базы данных, выносят в зависимости; настройки делят на несколько классов `BaseSettings` по доменам; зависимости в тестах подменяют через `dependency_overrides`.

### Y-FAPI-014 · SHOULD · К набору линтера профиля добавляют группу `FAST`; `B008` не отключают, а переводят зависимости на `Annotated`
- Проверка: `ruff FAST001`, `FAST002`, `FAST003`; `ruff B008`.
- Источник: [ruff, правила FastAPI (FAST)](https://docs.astral.sh/ruff/rules/#fastapi-fast) (проверено на ruff 0.16.8); [fastapi/fastapi, pyproject.toml](https://github.com/fastapi/fastapi/blob/master/pyproject.toml) (0.143.0, 2026-10-08; сам FastAPI `B008` игнорирует) · конфиг или инструмент · средняя · не Яндекс · реконструкция.

## Конфиг

Надстройка над [`../../configs/python/pyproject.toml`](../../configs/python/pyproject.toml) (тот же блок лежит в конце конфига комментарием):

```toml
# не Яндекс; проверено локально на ruff 0.16.8
[tool.ruff.lint]
extend-select = ["FAST"]   # FAST001, FAST002, FAST003

# Временно, пока зависимости не переведены на Annotated (Y-FAPI-005):
[tool.ruff.lint.flake8-bugbear]
extend-immutable-calls = ["fastapi.Depends", "fastapi.Query"]
```

Что показала локальная проверка (ruff 0.16.8, тестовый роутер):

- срабатывают `FAST001`, `FAST002`, `FAST003`;
- `B008` срабатывает на `db: Session = Depends(get_db)`, но не на параметры с неизменяемым типом (`q: str = Query(...)`); после `extend-immutable-calls` или перехода на `Annotated` предупреждение исчезает;
- с `--extend-select ASYNC` на блокирующие вызовы в `async def` срабатывают `ASYNC210`, `ASYNC230`, `ASYNC251`.

Версии (на 2026-10-09):

| Пакет | Версия | Источник версии |
|---|---|---|
| `fastapi` | 0.143.0 (2026-10-08); `requires-python >=3.10`, `starlette>=0.46.0`, `pydantic>=2.9.0` | [pyproject.toml](https://github.com/fastapi/fastapi/blob/master/pyproject.toml) |
| `pydantic` | 2.14.0 | git-теги |
| `pydantic-settings` | 2.15.0 | git-теги |
| `starlette` | 1.7.0 | git-теги |

FastAPI и перечисленные пакеты локально не запускались: реестр пакетов недоступен из среды сборки.

Для сравнения - как настроен линтер у самих авторов фреймворка (не Яндекс):

| Проект | ruff | mypy |
|---|---|---|
| [fastapi/fastapi](https://github.com/fastapi/fastapi/blob/master/pyproject.toml) | `select`: `E`, `W`, `F`, `I`, `B`, `C4`, `UP`; `ignore`: `E501`, `B008`, `C901` | - |
| [full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template/blob/master/backend/pyproject.toml) | `target-version = "py314"`; `select`: `E`, `W`, `F`, `I`, `B`, `C4`, `UP`, `ARG001`, `T201`; `ignore`: `E501`, `B008`, `W191`, `B904` | `strict = true` |

Набор профиля (`E4`, `E7`, `E9`, `F`, `W`, `I`, `UP`, `B`, `N`, `RUF`, `G`, `LOG`) пересекается с ними по `F`, `W`, `I`, `B`, `UP`; `E501` отключён во всех трёх.
