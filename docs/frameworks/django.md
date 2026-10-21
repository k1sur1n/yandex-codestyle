# Django - профиль Яндекса

> Данные актуальны на 2026-10-09.

Публичных правил Яндекса по Django - публичных данных не найдено. Из открытого кода есть один активный проект команды YDB (django-ydb-backend - бэкенд базы данных, а не образец прикладного приложения), заброшенный django_replicated и доклад 2020 года об истории Python в компании. Поэтому профиль состоит из общих Python-правил ([`../languages/python.md`](../languages/python.md)), трёх правил, выведенных из django-ydb-backend, и двенадцати общепринятых правил с пометкой «не Яндекс»: официальный Coding style проекта Django, линтер ruff (группа `DJ`), HackSoft Django Styleguide и django-stubs.

## Что публично есть у Яндекса

| Источник | Что это | Статус | Годится как источник правил |
|---|---|---|---|
| [ydb-platform/django-ydb-backend](https://github.com/ydb-platform/django-ydb-backend/blob/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/pyproject.toml#L72-L130) | бэкенд Django для YDB (`django>=4.2,<7.0`, Python ≥3.10); ruff с `select = ["ALL"]` и списком исключений, тесты через раннер Django, пример приложения `examples/bookstore` | активен, HEAD 2026-06-25; файла LICENSE в репозитории нет - лицензия не проверена | частично: настройки линтера и тестов (Y-DJ-001 … Y-DJ-003); это библиотека, а не прикладной сервис |
| [yandex/django_replicated](https://github.com/yandex/django_replicated) | роутер реплик базы данных | не обновляется: последний коммит 2020-04-10, tox под Python 2.7/3.5 и Django 1.7-1.11 | нет |
| [«Как в компании развивался Python»](https://habr.com/ru/companies/yandex/articles/509352/) (А. Кошелев, Habr, 2020-07-15) | история: первые крупные Python-сервисы Яндекса (Афиша, Погода, Телепрограмма) написаны на Django около 2007-2008 годов; бэкенд Алисы работал на Django до осени 2018 года | архивная статья | нет: правил стиля в докладе нет |

Крупнейший открытый Python-бэкенд Яндекса, [datalens-backend](https://github.com/datalens-tech/datalens-backend/blob/51a11cd763f8dbd9d826170d4b71f07db0a742cb/metapkg/pyproject.toml), написан не на Django, а на aiohttp и Flask. Примеров Django-приложений в организациях `yandex-cloud-examples`, `yandex` и `yandex-cloud` под проверенными именами (`yc-serverless-django`, `yc-django-container`) нет.

О внутренних правилах Яндекса для Django после 2020 года - публичных данных не найдено. Курсы Яндекс Практикума - учебные материалы, а не производственный стандарт; как источник правил они не использовались.

## Как совмещать с Python-профилем

Django-код подчиняется тем же правилам `Y-PY-*` и тому же конфигу, что и остальной Python. Три места, где источники расходятся:

| Тема | Профиль Python | Django и django-ydb-backend | Решение |
|---|---|---|---|
| Длина строки | 120 (Y-PY-002) | 88 для кода и 79 для комментариев в самом Django; 88 в django-ydb-backend | 120: значения Django - правила для кода самого фреймворка, а 88 в django-ydb-backend - значение ruff по умолчанию |
| Тесты | pytest (Y-PY-040) | раннер Django и `django.test.TestCase` | для Django-кода действует Y-DJ-001 |
| Порядок импортов | стандартные → сторонние → свои (Y-PY-011) | у Django отдельные группы «Django» и «local Django» | Y-PY-011: в прикладном проекте Django - обычный сторонний пакет |

## Правила, выведенные из открытого проекта Яндекса

### Y-DJ-001 · SHOULD · Тесты Django-кода пишут на `django.test.TestCase` с его assert-методами и запускают раннером Django
- Проверка: частично: если включена группа `PT`, для тестов отключают `ruff PT009` и `PT027`; остальное - ручное ревью.
- Источник: [django-ydb-backend, pyproject.toml](https://github.com/ydb-platform/django-ydb-backend/blob/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/pyproject.toml#L72-L121) и [AGENTS.md](https://github.com/ydb-platform/django-ydb-backend/blob/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/AGENTS.md) (2026-06-25) · конфиг или инструмент · средняя (один проект). Это исключение из Y-PY-040 только для Django-кода.

### Y-DJ-002 · SHOULD · Файлы миграций сохраняют имена, которые даёт Django (`0001_initial.py`), и не подгоняются под линтер
- Проверка: `ruff N999` в каталоге `migrations/` не срабатывает (проверено на ruff 0.16.8), для каталогов с другими именами нужен `per-file-ignores`; `RUF012` для миграций отключают там же.
- Источник: [django-ydb-backend, pyproject.toml](https://github.com/ydb-platform/django-ydb-backend/blob/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/pyproject.toml#L72-L130) (2026-06-25) · конфиг или инструмент · средняя (один проект).

### Y-DJ-003 · SHOULD · Проект раскладывают стандартно: каталог настроек `config/` (`settings.py`, `urls.py`, `asgi.py`, `wsgi.py`) и приложения с `models.py`, `views.py`, `admin.py`, `migrations/`, `management/commands/`
- Проверка: ручное ревью.
- Источник: [django-ydb-backend, examples/bookstore](https://github.com/ydb-platform/django-ydb-backend/tree/1c77be98f8044dbfa6b9e45baaca94bd29cdd5de/examples/bookstore) (2026-06-25) · практика, выведенная из репозиториев (1 пример приложения; из линтинга самого проекта он исключён) · низкая · реконструкция.

## Правила «не Яндекс»: Coding style проекта Django

Источник - [Coding style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/) из документации для контрибьюторов Django (dev-версия, 6.2 alpha; последний выпуск - 6.1.2; лицензия BSD-3-Clause). Это правила для кода самого фреймворка; к прикладным проектам их применяют по аналогии. Формулировки в источнике рекомендательные, поэтому уровень везде SHOULD.

### Y-DJ-004 · SHOULD · Первый параметр функции-представления называется `request`
- Проверка: ручное ревью.
- Источник: [Django coding style, View style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#view-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.

### Y-DJ-005 · SHOULD · Имена полей модели пишут строчными буквами с подчёркиваниями
- Проверка: частично: `ruff N815` ловит имена в смешанном регистре в теле класса; остальное - ручное ревью.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.

### Y-DJ-006 · SHOULD · Содержимое модели идёт в порядке: поля → менеджеры → `class Meta` → `__str__` и другие магические методы → `save()` → `get_absolute_url()` → остальные методы
- Проверка: `ruff DJ012`.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.
- Пример:

```python
# плохо
class Book(models.Model):
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    title = models.CharField(max_length=200)

    class Meta:
        ordering = ("title",)

# хорошо
class Book(models.Model):
    title = models.CharField(max_length=200)

    class Meta:
        ordering = ("title",)

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
```

### Y-DJ-007 · SHOULD · Варианты `choices` задают константами в верхнем регистре на классе модели или вложенным `models.TextChoices`
- Проверка: ручное ревью.
- Источник: [Django coding style, Model style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.

### Y-DJ-008 · SHOULD · `django.conf.settings` не читают на верхнем уровне модуля, то есть при импорте
- Проверка: ручное ревью.
- Источник: [Django coding style, Use of django.conf.settings](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#use-of-django-conf-settings) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.
- Пример:

```python
# плохо: значение читается при импорте модуля
from django.conf import settings

PAGE_SIZE = settings.CATALOG_PAGE_SIZE

# хорошо: значение читается при вызове
def get_page_size() -> int:
    return settings.CATALOG_PAGE_SIZE
```

### Y-DJ-009 · SHOULD · В f-строках используют только обращения к переменным и атрибутам; для переводимых строк f-строки не применяют
- Проверка: ручное ревью.
- Источник: [Django coding style, Python style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#python-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.

### Y-DJ-010 · SHOULD · Модули своего приложения импортируют относительно с одной точкой (`from .models import Book`); многоточечных относительных импортов избегают
- Проверка: ручное ревью; по желанию `ruff TID252` (запрещает импорты из родительских пакетов).
- Источник: [Django coding style, Imports](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#imports) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс. Согласуется с Y-PY-012.

### Y-DJ-011 · SHOULD · В тестах проверяют сообщение исключения (`assertRaisesMessage` вместо `assertRaises`) и точное значение (`assertIs(x, True)` вместо `assertTrue(x)`)
- Проверка: ручное ревью.
- Источник: [Django coding style, Python style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#python-style) (dev-версия, прочитана 2026-10-09) · производный гайд проекта · высокая · не Яндекс.

## Правила «не Яндекс»: линтер, архитектура, типы

Группа `DJ` линтера ruff (правила flake8-django) стабильна и подключается одной строкой. Кроме правил ниже в неё входят `DJ001` (у строковых полей нет `null=True`), `DJ003` (без `locals()` в `render`) и `DJ013` (`@receiver` - верхний декоратор); `DJ012` уже покрыт правилом Y-DJ-006.

### Y-DJ-012 · SHOULD · Каждая модель определяет метод `__str__`
- Проверка: `ruff DJ008`.
- Источник: [ruff, правила flake8-django (DJ)](https://docs.astral.sh/ruff/rules/#flake8-django-dj) (проверено на ruff 0.16.8) · конфиг или инструмент · высокая · не Яндекс.

### Y-DJ-013 · SHOULD · `ModelForm` перечисляет поля явно: без `exclude` и без `fields = "__all__"`
- Проверка: `ruff DJ006`, `DJ007`.
- Источник: [ruff, правила flake8-django (DJ)](https://docs.astral.sh/ruff/rules/#flake8-django-dj) (проверено на ruff 0.16.8) · конфиг или инструмент · высокая · не Яндекс.

### Y-DJ-014 · SHOULD · Бизнес-логику держат в сервисах (запись) и селекторах (чтение), а не в представлениях, сериализаторах, `save()`, менеджерах и сигналах
- Проверка: ручное ревью.
- Источник: [HackSoft Django Styleguide, Overview](https://github.com/HackSoftware/Django-Styleguide#overview) (последний коммит 2025-09-25, MIT) · сторонний источник · высокая · не Яндекс.

Правило Y-DJ-014 расходится с философией самого Django, по которой вся доменная логика принадлежит модели ([Design philosophies](https://docs.djangoproject.com/en/dev/misc/design-philosophies/#include-all-relevant-domain-logic)). Интерпретация: для небольшого приложения хватает подхода Django; сервисный слой окупается, когда одна операция затрагивает несколько моделей или внешние системы. Выбор фиксируют один раз на проект. Остальные соглашения HackSoft (один API-класс на операцию, отдельные `InputSerializer` и `OutputSerializer`, имена `<Сущность><Действие>Api`) - в [разделе APIs & Serializers](https://github.com/HackSoftware/Django-Styleguide#apis--serializers).

### Y-DJ-015 · SHOULD · Проверку типов (Y-PY-031, Y-PY-032) в Django-проекте ведут с пакетом `django-stubs` и его плагином mypy
- Проверка: mypy с `plugins = ["mypy_django_plugin.main"]`.
- Источник: [typeddjango/django-stubs, README](https://github.com/typeddjango/django-stubs/blob/master/README.md) (тег 6.1.2, 2026-10) · конфиг или инструмент · высокая · не Яндекс. В Coding style самого Django об аннотациях типов ничего не сказано, а django-ydb-backend аннотаций не требует (`ANN` в списке игнорируемых).

## Конфиг

Надстройка над [`../../configs/python/pyproject.toml`](../../configs/python/pyproject.toml) (тот же блок лежит в конце конфига комментарием):

```toml
# не Яндекс; проверено локально на ruff 0.16.8
[tool.ruff.lint]
extend-select = ["DJ"]   # DJ001, DJ003, DJ006, DJ007, DJ008, DJ012, DJ013

[tool.ruff.lint.per-file-ignores]
"**/migrations/*.py" = ["RUF012"]      # Y-DJ-002
"**/test_*.py" = ["PT009", "PT027"]    # Y-DJ-001; нужно, только если включена группа PT
```

```toml
# не Яндекс; не запускалось: реестр пакетов недоступен из среды сборки.
# Опции взяты из README django-stubs (тег 6.1.2).
[tool.mypy]
plugins = ["mypy_django_plugin.main"]

[tool.django-stubs]
django_settings_module = "myproject.settings"   # <PROJECT>: модуль настроек вашего проекта
```

Что показала локальная проверка первого блока (ruff 0.16.8, тестовое приложение с моделью, формой, миграцией и тестом):

- срабатывают `DJ001`, `DJ007`, `DJ008`, `DJ012`;
- `N999` на `migrations/0001_initial.py` не срабатывает, а в каталоге с другим именем срабатывает - поэтому django-ydb-backend исключает свои каталоги `migrations_*` отдельной строкой;
- `RUF012` из набора профиля срабатывает на списки в `class Meta` (`ordering = ["title"]`) и в миграциях: пишите кортежи либо отключите правило, как сделано в django-ydb-backend.

Версии (по git-тегам на 2026-10-09):

| Пакет | Версия | Примечание |
|---|---|---|
| `django-stubs` | 6.1.2 | Django 6.1; mypy 1.13-2.4; Python 3.11-3.14 - для такого проекта базу из Y-PY-046 придётся поднять до 3.11 |
| `django-upgrade` | 1.33.0 | автоматическое обновление синтаксиса под версию Django; документация не читалась, локально не запускался |
| `djLint` | 1.46.4 | линтер шаблонов; документация не читалась, локально не запускался |

Сам Django проверяет свой код black 26.5.1, isort 8.0.1 и flake8 7.3.0 ([.pre-commit-config.yaml](https://github.com/django/django/blob/main/.pre-commit-config.yaml)); профиль вместо них использует ruff (Y-PY-001).
