# Яндекс: C++

> Данные актуальны на 2026-10-09.

Единого публичного «Yandex C++ Style Guide» нет: общий гайд Аркадии лежит на внутреннем хосте, а снаружи видны его производные тексты и три разных стиля - аркадийный (util, CatBoost, YDB), стиль YTsaurus и стиль userver. Профиль берёт аркадийный вариант: правила - из `CPP_STYLE_GUIDE.md` в репозитории CatBoost, форматирование - дословная копия дефолтного `.clang-format` Аркадии, проверка имён - реконструированный `.clang-tidy`. Префиксы `T`/`I`/`E`/`N` подтверждены текстами и кодом четырёх кодовых баз из пяти; userver именует всё в стиле Google и описан как альтернатива. Из 68 правил инструмент полностью проверяет 23, частично - 7, на ручное ревью остаётся 38.

Содержание: [1. Источники](#1-источники-и-обозначения) · [2. Аркадия в открытом коде](#2-соглашения-аркадии-в-открытом-коде-что-подтверждается) · [3. Форматирование](#3-форматирование) · [4. Именование](#4-именование) · [5. Файлы и include](#5-структура-файлов-и-порядок-include) · [6. Комментарии](#6-комментарии-и-документирование) · [7. Ошибки, логи, типы](#7-обработка-ошибок-логирование-типы) · [8. Ограничения языка](#8-запрещённые-и-ограниченные-возможности-языка) · [9. Тесты](#9-тесты) · [10. Стандарт и изменения](#10-стандарт-языка-и-изменения-за-2024-2026-годы) · [11. Существующий код](#11-существующий-код) · [12. Конфиги](#12-машиночитаемые-конфиги) · [13. Альтернативы](#13-альтернативы-стиль-userver-и-стиль-ytsaurus) · [14. Чего нет](#14-чего-в-публичных-источниках-нет)

## 1. Источники и обозначения

Все источники - файлы в открытых репозиториях Яндекса под Apache-2.0. Ссылки зафиксированы на коммиты, которые были последними 2026-10-09.

| Источник | Что это | Статус, последняя содержательная правка | Роль в профиле |
|---|---|---|---|
| Общий гайд Аркадии по C++ (`docs.yandex-team.ru/arcadia-cpp/cpp_style_guide`) | внутренний документ; на него ссылается [README util](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L3-L5) | не публичен | недоступен; источником быть не может |
| [CPP_STYLE_GUIDE.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md) в CatBoost | публичная редакция аркадийного гайда; [обязательна](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/docs/en/concepts/development-and-contributions.md#L274-L278) для контрибьюторов CatBoost | активен, 2026-09-21 | основной источник правил |
| [catboost_command_style_guide_extension.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md) | дополнения команды CatBoost, на русском | не обновляется с 2023-12-01 | источник отдельных правил, каждый раз с пометкой |
| [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md) | более строгий вариант гайда для каталога `util/` | активен, 2025-11-06 | уточняет спорные места |
| [ydb/agents/CODESTYLE.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md), [NO_ABORT.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/NO_ABORT.md), [TESTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/TESTS.md) | те же аркадийные правила, переизложенные YDB для ИИ-агентов | активны, 2026-07-20, 2026-07-29, 2026-09-09 | второй текст тех же правил; правила о тестах и abort |
| [yt/styleguide/cpp.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md) | гайд YTsaurus | активен, 2026-08-29 | альтернативный стиль; источник тем, которых нет в аркадийном гайде (логи, `auto`, владение) |
| [build/config/tests/cpp_style/.clang-format](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format) | дефолтный конфиг форматирования Аркадии; владелец - группа [`cppcommittee`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml); один и тот же файл в yatool, catboost, ydb, ytsaurus | активен, 2025-10-30 | скопирован в [`configs/cpp/.clang-format`](../../configs/cpp/.clang-format) |
| [build/config/tests/clang_tidy/config.yaml](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/clang_tidy/config.yaml) | дефолтный конфиг clang-tidy Аркадии | активен, 2026-05-22 | основа [`configs/cpp/.clang-tidy`](../../configs/cpp/.clang-tidy) |
| [yql/essentials/.clang-tidy](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy), [yt/yt/flow/.clang-tidy](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/flow/.clang-tidy) | проектные конфиги clang-tidy | активны, 2026-10-05 и 2026-07-14 | источник дополнительных проверок |
| userver: [.clang-format](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-format), [.clang-tidy](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-tidy), [AGENTS.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md) | конфиги и инструкция для ИИ-агентов; письменного гайда по стилю у userver нет | активны, 2025-11-23, 2026-04-08, 2026-10-07 | альтернативный стиль, [раздел 13](#13-альтернативы-стиль-userver-и-стиль-ytsaurus) |

Обозначения в правилах:

- «Гайд» без уточнения - `CPP_STYLE_GUIDE.md` из CatBoost; «дополнения CatBoost» - `catboost_command_style_guide_extension.md`.
- «Дефолт Аркадии» - опция есть в дефолтном `.clang-format` или `config.yaml` Аркадии. «Реконструкция» - опцию или правило добавили авторы профиля; у Яндекса такого файла или текста нет.
- Уровень `MUST` стоит там, где источник пишет «must», «prohibited», «always», «not allowed» или где правило навязывает дефолтный конфиг форматирования. Формальных уровней в духе RFC 2119 источники не задают - уровни восстановлены по формулировкам.
- Подсчёты «по коду» - grep-эвристики по перечисленным каталогам на тех же коммитах. Это оценки, а не точный разбор.

## 2. Соглашения Аркадии в открытом коде: что подтверждается

**Вывод.** Префиксы существуют и соблюдаются: `T` - классы, структуры и алиасы типов, `I` - интерфейсы, `E` - перечисления, `N` - пространства имён, `Y_` - публичные макросы util; в новом коде util и YTsaurus появился ещё `C` - концепты. Методы и свободные функции пишутся в PascalCase, локальные переменные и параметры - в camelCase, поля - в PascalCase. Это верно для util, CatBoost, YDB и YTsaurus и **не верно для userver**: там имена в стиле Google (`HttpHandlerBase`, поля `snake_case_`, константы `kCamelCase`, пространства имён `lower_case`).

Каталог `util/` опубликован в четырёх репозиториях (catboost, ydb, ytsaurus, yatool); ссылки ниже ведут на копию в catboost.

| Что именуется | util | CatBoost | YDB | YTsaurus | userver |
|---|---|---|---|---|---|
| Классы, структуры | `T` + PascalCase: [`TRefCounted`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L430), [`THolder`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L265), [`TVector`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/vector.h#L16) | [`TCatBoostException`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/helpers/exception.h#L5) | `T`-типы в [actor.h](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/actor.h#L17-L25) | [`TAsyncExpiringCache`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/async_expiring_cache.h#L24-L25) | без префикса: [`Mutex`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L28), [`HttpHandlerBase`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/server/handlers/http_handler_base.hpp#L58) |
| Алиасы типов | [`using TAtomicSharedPtr = …`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L1060) | - | - | алиасы указателей `<Тип>Ptr` (`IInvokerPtr`) из [`DECLARE_REFCOUNTED_STRUCT`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/public.h#L35) | PascalCase без префикса (опция [`TypedefCase: CamelCase`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-tidy#L126-L204)) |
| Интерфейсы | [`IOutputStream`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/stream/output.h#L22) | [`IModelTreeData`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/model.h#L578) | `I`-типы в [actor.h](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/actor.h#L17-L25) | [`struct IInvoker`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/invoker.h#L16-L18) | понятия нет |
| Перечисления | [`enum class ETestFlag2`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/flags_ut.cpp#L16) | [`enum class EPredictionType`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/enums.h#L5) | `E` + PascalCase; значения нескоупных enum - [`EvPut`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/blobstorage.h#L113-L117), [`TacticMaxThroughput`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/blobstorage.h#L766-L767), а не `UPPER_CASE` из гайда | [`DEFINE_ENUM(ELockType, …)`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/client/table_client/schema.h#L23-L29), значения PascalCase | [`enum class Importance { kNormal, … }`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/task/task_base.hpp#L37-L39) |
| Пространства имён | [`NDetail`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L104), [`NPrivateException`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/yexception.h#L21) | [`NCatboostStandalone`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/standalone_evaluator/evaluator.h#L8-L53) | [`NActors`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/actor.h#L17-L25) | [`namespace NYT {`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/invoker.h#L12) | `lower_case`: [`server::handlers`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/server/handlers/http_handler_base.hpp#L34) |
| Концепты | `C`: [`CInputRangeOf`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ranges.h#L13) | не проверялось | `T`: [`TEventWithLoadSupport`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/event.h#L54) | `C`: [`CFuture`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/future.h#L880), [`CErrorRange`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/error/error.h#L78) | без префикса: [`ContainerHasName`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/components/container.hpp#L36) |
| Методы и функции | PascalCase: [`Release()`, `Reset()`, `Swap()`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L322-L345), [`MakeHolder`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L419) | PascalCase, в том числе в C API: [`ModelCalcerCreate`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model_interface/c_api.h#L1-L59) | [`SplitPath`, `JoinPath`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/path.cpp#L11) | PascalCase ([гайд YT](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L74)) | PascalCase: [`IsValid()`, `GetState()`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/task/task_base.hpp#L106-L111); STL-совместимые - [`lock()`, `unlock()`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L44-L50) |
| Приватные поля | PascalCase + `_`: [`T* T_;`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L415) | PascalCase **без** `_`: [model.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/model.h#L574-L581), [ctr_data.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/ctr_data.h#L62-L64) | PascalCase **без** `_`: [cputime.h](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/cputime.h#L44-L46), [domain.h](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/domain.h#L74) | PascalCase + `_`: [`Logger_`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/async_expiring_cache.h#L80) | `snake_case_`: [http_handler_base.hpp](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/server/handlers/http_handler_base.hpp#L216-L227) |
| Локальные переменные | camelCase | [`internalFloatIndex`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/model.cpp#L193) | [`prevpos`, `pos`, `len`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/path.cpp#L18-L20) | [`dstOffsetSave`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/bitmap.cpp#L13-L14) | `snake_case`: [semaphore.cpp](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/src/engine/semaphore.cpp#L82-L83) |
| Константы уровня namespace | `UPPER_CASE` (эвристика: 11 против 1) | `UPPER_CASE`: [`TEST_COUNT`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/helpers/ut/wx_test_ut.cpp#L8-L11) | в основном PascalCase: [`MaxProtobufSize`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/blobstorage.h#L41-L43) | PascalCase: [`MaxKeyColumnCount`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/client/table_client/public.h#L89-L91) | `kCamelCase`: [`kEnableAssert`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/universal/include/userver/utils/assert.hpp#L33-L35) |
| Макросы | `Y_UPPER_CASE`: [`Y_FORCE_INLINE`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/system/compiler.h#L107-L112), [`Y_ABORT_UNLESS`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/system/yassert.h#L80); историческое исключение - [`ythrow`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/yexception.h#L156) | префикс проекта: [`CB_ENSURE`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/helpers/exception.h#L15) | [`LOG_DEBUG_S`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/log.h#L101-L105), [`AFL_ENSURE`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/log.h#L681), [`YDB_LOG_INFO`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/library/actors/core/log.h#L826) | [`YT_VERIFY`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/assert/assert.h#L68), [`THROW_ERROR_EXCEPTION`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/error/error.h#L428) | [`UASSERT`, `UINVARIANT`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/universal/include/userver/utils/assert.hpp#L56-L77) |
| Шаблонные параметры | [`template <class T, class D>`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L187), встречается и `TAllocParam` | - | - | [`template <class TKey, class TValue>`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/async_expiring_cache.h#L24-L25) | [`template <typename Rep, typename Period>`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L66) |
| Файлы | `snake_case`, `.h` + `.cpp`, тесты `*_ut.cpp` рядом с кодом ([util/generic](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic)) | тесты в `ut/`: [model_serialization_ut.cpp](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/ut/model_serialization_ut.cpp#L26-L27) | тесты в `ut/`: [path_ut.cpp](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base/ut/path_ut.cpp#L60-L61) | шаблоны в [`*-inl.h`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/future.h#L891-L893), тесты в [`unittests/*_ut.cpp`](https://github.com/ytsaurus/ytsaurus/tree/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/unittests) | `.hpp` + `.cpp`, тесты [`*_test.cpp`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/samples/hello_service/unittests/say_hello_test.cpp) |

Что показывают подсчёты (grep-эвристика по заголовкам, число объявлений вида «тип + имя;»):

- **Поля с завершающим `_`.** Шаблоны «PascalCase с `_`» / «PascalCase без `_`»: [`ydb/core/base`](https://github.com/ydb-platform/ydb/tree/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/base) - 0 / 1195; [`catboost/libs/model`](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model) - 0 / 203; `util/generic` - 67 / 57; [`yt/yt/core/misc`](https://github.com/ytsaurus/ytsaurus/tree/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc) - 353 / 366; `yt/yt/core/actions` - 91 / 17. Эвристика не отличает публичные поля структур от приватных полей классов, но ноль в YDB и CatBoost однозначен: правило о `_`, которое гайд получил [2026-07-18](https://github.com/catboost/catboost/commit/3874f154ccdb464319de129e17c59a9129e52b19), описывает новый код, а не существующий.
- **Константы уровня namespace.** `UPPER_CASE` против PascalCase: [`util`](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/util) - 11 / 1; [`catboost/libs`](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs) - 10 / 0; `ydb/core/base` - 7 / 36; [`yt/yt/core`](https://github.com/ytsaurus/ytsaurus/tree/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core) - 0 / 66. Норма гайда соблюдается в util и CatBoost; YDB и YTsaurus пишут PascalCase (YTsaurus - по собственному гайду).
- **userver.** В [`core/include/userver`](https://github.com/userver-framework/userver/tree/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver) полей `snake_case_` - 265, полей в PascalCase с `_` - 0; констант `kCamelCase` - 82 против одной в `UPPER_CASE`.

Что не подтвердилось или подтвердилось с оговоркой:

- Префикс `C` у концептов ни в одном публичном гайде не записан; он выведен из кода util и YTsaurus, а в акторной библиотеке YDB концепт назван с `T`.
- Дефолтный clang-tidy Аркадии префиксы `T`/`I`/`E`/`N` **не проверяет**: в нём заданы только регистр и суффикс `_`. Опции `StructPrefix: T`, `EnumPrefix: E`, `NamespacePrefix: N` записаны в [конфиге YQL](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy#L432-L439), но сама проверка `readability-identifier-naming` там [выключена](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy#L389). В Яндексе префиксы держатся на ревью; в профиле их проверяет реконструированный конфиг.
- Публичного правила об именах шаблонных параметров и каталогов нет - только наблюдения по коду.

### Три стиля и выбор профиля

«Стиль Яндекса для C++» - это три стиля. Аркадийный и стиль YTsaurus совпадают в именах и расходятся в оформлении; userver стоит отдельно.

| Параметр | Аркадия (гайд CatBoost, util, YDB) | YTsaurus ([гайд](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md)) | userver ([.clang-format](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-format), [.clang-tidy](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-tidy#L126-L204)) | Профиль |
|---|---|---|---|---|
| Типы | `TFoo`, `IFoo`, `EFoo` | то же | `Foo` | `TFoo`, `IFoo`, `EFoo` |
| Интерфейс `I` | класс с чисто виртуальным методом и без полей | `struct` только с чисто виртуальными методами | - | определение Аркадии |
| Методы, функции | PascalCase | PascalCase | PascalCase | PascalCase |
| Приватные поля | `Name_` (гайд с 2026-07-18 и clang-tidy); старый код - `Name` | `Name_` | `name_` | `Name_` |
| Локальные, параметры | camelCase | camelCase | `snake_case` | camelCase |
| Константы уровня namespace | `UPPER_CASE` | PascalCase | `kCamelCase` | `UPPER_CASE` (спорно, см. Y-CPP-028) |
| Значения enum | PascalCase у `enum class` и вложенных; `FT_SIMPLE` у глобальных нескоупных | PascalCase | `kCamelCase` | `enum class` + PascalCase |
| Пространства имён | `NFoo`, не глубже двух уровней | `NYT::NFoo` | `lower_case` | `NFoo` |
| Тело namespace | с отступом (`NamespaceIndentation: All`) | без отступа | без отступа | с отступом (спорно, см. Y-CPP-010) |
| `{` у функций и классов | на той же строке (гайд допускает оба варианта, util - только K&R) | на следующей строке | на той же строке | на той же строке |
| Отступ, длина строки | 4 пробела; `ColumnLimit: 0`, в CatBoost ориентир 110 | 4 пробела; в гайде длина не задана | 4 пробела; 120 | 4 пробела; без жёсткого предела, ориентир 110 |
| Заголовки | `.h`, `#pragma once` | `.h`, шаблоны в `-inl.h` | `.hpp` | `.h`, `#pragma once` |
| Порядок include | от частного к общему, стандартная библиотека в конце | так же | стандартная библиотека раньше своих заголовков | от частного к общему |
| Контейнеры и строки | типы util: `TString`, `TVector`, `THashMap` | в core - `std::` | только `std::` | `std::` (util вне Аркадии недоступен) |
| Ошибки | `yexception`, `ythrow`, `Y_ENSURE` | `TError`, `THROW_ERROR_EXCEPTION`, `YT_VERIFY` | исключения `std::`, `UASSERT` | исключения; базовый класс проекта |
| Тесты | unittest (`Y_UNIT_TEST`), `ut/*_ut.cpp` | GoogleTest, `unittests/*_ut.cpp` | GoogleTest (`UTEST`), `*_test.cpp` | GoogleTest, `ut/*_ut.cpp` |
| Форматтер | `ya style` → `ynd-clang-format-18` + дефолтный конфиг | конфигов нет; для Flow - `ya style --cpp-yt` | `.clang-format` на базе Google с опцией, которой нет в апстриме | дефолтный конфиг Аркадии на стоковом clang-format |

Почему профиль берёт аркадийный вариант:

1. Это единственный вариант с публичным письменным гайдом, [объявленным обязательным](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/docs/en/concepts/development-and-contributions.md#L274-L278) для внешних контрибьюторов продукта.
2. Его конфиг форматирования один и тот же в четырёх репозиториях и имеет названного владельца - [`cppcommittee`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/a.yaml).
3. Этот конфиг читается стоковым clang-format 18 (проверено локально), а конфиги [YT Flow](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/flow/.clang-format) и [userver](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-format#L30-L31) - нет: в них есть опции собственных сборок.
4. YTsaurus сам [пишет](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L29), что его стиль не выражается средствами clang-format и clang-tidy.
5. Остальные проекты движутся к нему: YDB в 2026 году [записал](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md) те же правила, userver в 2025 году [перевёл](https://github.com/userver-framework/userver/commit/7d7b2f4008e0c5a334ff7350b815360ad61fb9d7) оформление на «ya style» (имена остались прежними).

Внутри самого аркадийного варианта источники расходятся в пяти местах. Каждое разобрано в своём правиле: завершающий `_` у приватных полей (Y-CPP-026), константы уровня namespace (Y-CPP-028), отступ в namespace (Y-CPP-010), скобка после списка инициализации конструктора (Y-CPP-005), директивы препроцессора (Y-CPP-017).

## 3. Форматирование

Форматирует `clang-format` с дефолтным конфигом Аркадии; в профиле это [`configs/cpp/.clang-format`](../../configs/cpp/.clang-format). В Аркадии тот же конфиг применяет команда [`ya style`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/en/style.md#L29-L30), а проверяет макрос сборки [`STYLE_CPP()`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/ymake.core.conf#L5789-L5795); в обычном git-репозитории его эквивалент - задача CI `clang-format --dry-run --Werror` (реконструкция, в публичных CI Яндекса такой задачи нет).

### Y-CPP-001 · MUST · Отступ - 4 пробела, табуляция запрещена
- Проверка: `clang-format: IndentWidth: 4`, `TabWidth: 4`, `UseTab: Never`, `ContinuationIndentWidth: 4`.
- Источник: [гайд, «Tabs» и «Indents»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L155-L161) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L45-L47](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L45-L47) (2025-10-30) · конфиг или инструмент · высокая.

### Y-CPP-002 · MUST · Блоки `if`, `for`, `while` оформляются в стиле 1TBS: `{` на строке оператора, `else` на строке закрывающей скобки
- Проверка: `clang-format: BreakBeforeBraces: Attach`.
- Источник: [гайд, «Block style»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L165-L187) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L48](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L48) (2025-10-30) · конфиг или инструмент · высокая.
- Расхождение гайда с инструментом: гайд делает исключение - если условие не поместилось в одну строку, `{` ставится на отдельной строке. Опция `Attach` этого не выражает: стоковый clang-format 18.1.3 прижимает скобку к последней строке условия (проверено локально). Профиль принимает вывод форматтера, иначе проверка в CI не пройдёт.

### Y-CPP-003 · MUST · Открывающая скобка функции, метода и класса стоит на той же строке; в одном файле стиль скобок один
- Проверка: `clang-format: BreakBeforeBraces: Attach`.
- Источник: [гайд, «Block style»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L189-L202) (2026-09-21) · производный гайд проекта · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L7) (2025-11-06) · производный гайд проекта · высокая; [.clang-format Аркадии, L48](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L48) (2025-10-30) · конфиг или инструмент · высокая.
- Варианты: гайд разрешает для функций оба положения скобки и требует только единообразия в файле; util допускает лишь K&R; дефолтный конфиг задаёт `Attach`. Профиль следует конфигу и util. В YTsaurus скобка классов и функций стоит на следующей строке - см. [раздел 13](#13-альтернативы-стиль-userver-и-стиль-ytsaurus).

### Y-CPP-004 · MUST · Тело из одного оператора пишется с новой строки и в фигурных скобках; пустое тело цикла запрещено
- Проверка: частично: `clang-format: InsertBraces: true`, `AllowShortIfStatementsOnASingleLine: false`, `AllowShortLoopsOnASingleLine: false`, `AllowShortBlocksOnASingleLine: false`, `AllowShortFunctionsOnASingleLine: None`; `clang-tidy readability-braces-around-statements`; пустое тело цикла - ручное ревью.
- Источник: [гайд, «Short blocks»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L204-L226) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L10-L13 и L49](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L10-L13) (`InsertBraces` добавлен [2024-11-22](https://github.com/yandex/yatool/commit/62ce72f44)) · конфиг или инструмент · высокая.
- Пример:

```cpp
// плохо
if (something) A();
for (int i = 0; i < 100; i++);

// хорошо
if (something) {
    A();
}
```

### Y-CPP-005 · MUST · Список инициализации конструктора: каждый элемент на своей строке, двоеточие и запятые - в начале строк
- Проверка: `clang-format: BreakConstructorInitializers: BeforeComma`, `PackConstructorInitializers: Never`, `ConstructorInitializerIndentWidth: 4`.
- Источник: [гайд, «Constructors»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L410-L420) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L18 и L33](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L18) (2025-10-30) · конфиг или инструмент · высокая.
- Расхождение гайда с инструментом: в гайде и в коде util ([ptr.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L300-L302)) скобка `{` после списка стоит на отдельной строке. Так форматирует собственная сборка Яндекса (`ynd-clang-format-18`); в стоковом clang-format такой опции нет, и он прижимает скобку к последнему инициализатору. В локальном прогоне стокового 18.1.3 по `util/generic`, `util/system` и `util/string` у 101 из 113 отличающихся файлов это было единственным отличием (измерение авторов исследования). Профиль принимает вывод стокового форматтера; вариант с отдельной строкой описан в [разделе 12](#12-машиночитаемые-конфиги).

```cpp
// гайд и код util (сборка Яндекса)
TPoint::TPoint(int x, int y)
    : X_(x)
    , Y_(y)
{
}

// профиль: стоковый clang-format 18.1.3 с тем же конфигом
TPoint::TPoint(int x, int y)
    : X_(x)
    , Y_(y) {
}
```

### Y-CPP-006 · MUST · `*` и `&` примыкают к типу: `const T& value`, `int* p`
- Проверка: `clang-format: PointerAlignment: Left`, `DerivePointerAlignment: false`.
- Источник: [гайд, «Pointers and references»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L265-L269) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L21 и L40](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L40) (2025-10-30) · конфиг или инструмент · высокая.

### Y-CPP-007 · MUST · Пробел ставится между ключевым словом и скобкой и вокруг бинарных операторов; после имени функции, внутри скобок, между `>>` в шаблонах и в конце строки пробелов нет
- Проверка: `clang-format: SpaceBeforeParens: ControlStatements`, `SpacesInParentheses: false`, `SpacesInAngles: false`, `SpaceBeforeAssignmentOperators: true`; пробелы в конце строк clang-format удаляет сам.
- Источник: [гайд, «Spaces»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L236-L307) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L65-L70 и L83](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L65-L70) (2025-10-30) · конфиг или инструмент · высокая.

### Y-CPP-008 · MUST · `template <...>` занимает отдельную строку, после слова `template` стоит пробел
- Проверка: `clang-format: AlwaysBreakTemplateDeclarations: true`; пробел даёт `SpaceAfterTemplateKeyword` (в конфиге не задан, действует значение по умолчанию `true`).
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L406) (2026-09-21) · производный гайд проекта · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L14) (2025-11-06) · производный гайд проекта · высокая; [.clang-format Аркадии, L14](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L14) (2025-10-30) · конфиг или инструмент · высокая.

### Y-CPP-009 · MUST · В списке базовых классов перед двоеточием пробела нет: `class TFoo: public TBar`
- Проверка: `clang-format: SpaceBeforeInheritanceColon: false`.
- Источник: [.clang-format Аркадии, L88](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L88) (2025-10-30) · конфиг или инструмент · высокая; так же написан [пример в гайде](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L505) (2026-09-21) · производный гайд проекта · средняя.

### Y-CPP-010 · MUST · Тело пространства имён пишется с отступом, как тело класса; закрывающая скобка несёт комментарий `// namespace NName`
- Проверка: `clang-format: NamespaceIndentation: All`, `FixNamespaceComments: true`, `ShortNamespaceLines: 0`.
- Источник: [гайд, «Namespaces»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L451-L463) (2026-09-21; комментарий стал обязательным [2026-08-03](https://github.com/catboost/catboost/commit/e73308f4317de81894686542bc575d61b7f3cf7e)) · производный гайд проекта · высокая для комментария, средняя для отступа; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L16) (2025-11-06) · производный гайд проекта · высокая; [.clang-format Аркадии, L28-L30](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L28-L30) (2025-10-30) · конфиг или инструмент · высокая.
- Спорный пункт - отступ. Конфиг YQL отличается от дефолта одной строкой: [`NamespaceIndentation: None`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-format#L28); гайд YTsaurus [не сдвигает](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L716) тело namespace; userver тоже. По коду (эвристика: первая строка после `namespace X {` в заголовках, «с отступом / без»): `util/generic` - 32 / 1, `catboost/libs/model` - 13 / 0, `ydb/library/actors/core` - 53 / 20, `ydb/core/base` - 29 / 46, `ydb/core/kqp/common` - 1 / 41, `yt/yt/core/misc` - 0 / 148, `userver/core/include/userver` - 0 / 67. Профиль берёт `All`, потому что так написано в гайде и в дефолтном конфиге `cppcommittee`. Команде, которой ближе вариант без отступа, достаточно заменить значение на `None`, как сделано в YQL.

### Y-CPP-011 · MUST · Метки доступа стоят в колонке начала класса и всегда указаны явно, включая первый `private:`
- Проверка: частично: `clang-format: AccessModifierOffset: -4`; явный первый спецификатор - ручное ревью.
- Источник: [гайд, «Class and structure definitions»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L378) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L2](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L2) (2025-10-30) · конфиг или инструмент · высокая.

### Y-CPP-012 · MUST · Методы и поля лежат в разных секциях доступа; порядок внутри секции - конструкторы, деструктор, операторы, остальные методы; секция `public` с методами идёт раньше `protected` и `private`
- Проверка: ручное ревью.
- Источник: [гайд, «Class and structure definitions»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L380-L389) (2026-09-21) · производный гайд проекта · высокая.
- Пример: поля - в конце класса, в собственной секции:

```cpp
class TCache: public ICache {
public:
    explicit TCache(size_t capacity);
    ~TCache() override;

    void Clear() override;

private:
    void Evict();

private:
    size_t Capacity_ = 0;
};
```

### Y-CPP-013 · SHOULD · Одно объявление на строку; смешивать в одном объявлении массивы, указатели, ссылки и простые типы и переносить объявление на следующую строку нельзя
- Проверка: `clang-tidy readability-isolate-declaration`. Проверка строже гайда: она срабатывает и на разрешённое гайдом `int level, size;`.
- Источник: [гайд, «Variable declarations»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L361-L372) (2026-09-21) · производный гайд проекта · высокая; проверка включена в [конфиге YQL](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy) (2026-10-05) · конфиг или инструмент · высокая.
- Уровень: «одно на строку» в гайде названо предпочтительным, поэтому SHOULD; запрет на смешение типов и на перенос там сформулирован жёстко.

### Y-CPP-014 · SHOULD · Инициализатор поля задаёт явное значение - `= nullptr`, `= 0`, а не `= {}`; форма `= {}` предпочтительнее `{}`
- Проверка: ручное ревью.
- Источник: [гайд, «Class and structure definitions»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L391) (правило добавлено [2026-07-25](https://github.com/catboost/catboost/commit/a853a405d36d0e1511877b5d51babb0c7dc28ecd)) · производный гайд проекта · высокая.

### Y-CPP-015 · MUST · В одном классе поля инициализируются одним способом: либо в объявлении, либо в списке инициализации конструктора
- Проверка: ручное ревью.
- Источник: [гайд, «Initializing class data»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L422-L447) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-016 · MUST · Лямбда в одну строку допустима только как аргумент в месте использования и только с одним оператором; остальные лямбды оформляются как блок 1TBS
- Проверка: ручное ревью. Опция `AllowShortLambdasOnASingleLine` в конфиге не задана, действует значение LLVM `All`: короткую лямбду clang-format оставляет в одну строку.
- Источник: [гайд, «Lambda functions»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L337-L355) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-017 · MUST · Вложенные директивы препроцессора сдвигаются на 4 пробела вместе с `#`; директива верхнего уровня начинается с первой колонки
- Проверка: `clang-format: IndentPPDirectives: BeforeHash`.
- Источник: [.clang-format Аркадии, L86](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L86) (2025-10-30) · конфиг или инструмент · высокая; [YDB CODESTYLE.md, «Files and preprocessor»](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L326-L327) (2026-07-20) · производный гайд проекта · высокая.
- Расхождение гайда с инструментом: текст гайда CatBoost [требует](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L555-L567) держать `#` в первой колонке и ставить отступ после него. Код util ([compiler.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/system/compiler.h#L3-L13)) написан так, как форматирует конфиг, и редакция YDB описывает поведение конфига. Профиль следует конфигу.

```cpp
// текст гайда CatBoost
#ifdef Z
#   include <a.h>
#endif

// профиль: конфиг Аркадии и код util
#ifdef Z
    #include <a.h>
#endif
```

### Y-CPP-018 · SHOULD · Длину строки форматтер не ограничивает; ориентир - не длиннее 110 символов
- Проверка: ручное ревью. `clang-format: ColumnLimit: 0` означает, что строки не переносятся и длина не проверяется.
- Источник: [.clang-format Аркадии, L20](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L20) (2025-10-30) · конфиг или инструмент · высокая; [дополнения CatBoost, п. 12](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L34) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Основной гайд длину строки не ограничивает; число 110 - правило одной команды. У userver предел жёсткий: `ColumnLimit: 120`.

### Y-CPP-019 · SHOULD · Длинный список параметров или аргументов переносится целиком: первый элемент - с новой строки, отступ 4 пробела, по одному на строку
- Проверка: ручное ревью. При `ColumnLimit: 0` clang-format сохраняет авторские переносы; отступ продолжения задаёт `ContinuationIndentWidth: 4`.
- Источник: [дополнения CatBoost, п. 11](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L23-L33) (не обновляется с 2023-12-01) · производный гайд проекта · средняя; [гайд YT, «Indents»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L750-L768) (2026-08-29) · производный гайд проекта · высокая.
- Пример:

```cpp
// плохо
SomeFunction(veryLongArgument1,
             veryLongArgument2);

// хорошо
SomeFunction(
    veryLongArgument1,
    veryLongArgument2);
```

Что ещё задаёт конфиг (отдельных правил в профиле нет):

| Опция | Эффект |
|---|---|
| `IndentCaseLabels: true` | метки `case` сдвинуты на уровень относительно `switch` |
| `AllowShortFunctionsOnASingleLine: None` | даже пустая функция занимает две строки: `{` и `}` |
| `MaxEmptyLinesToKeep: 1`, `KeepEmptyLinesAtTheStartOfBlocks: false` | не больше одной пустой строки подряд; [дополнения CatBoost](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L9-L12) допускают две на верхнем уровне - конфиг строже |
| `SpacesBeforeTrailingComments: 1` | один пробел перед комментарием в конце строки |
| `SortIncludes: false` | порядок `#include` форматтер не меняет (см. Y-CPP-039) |
| `IndentExternBlock: Indent` | тело `extern "C" { … }` пишется с отступом |
| `Standard: c++20` | разбор синтаксиса по C++20 |
| `NamespaceMacros`, `ForEachMacros`, `AttributeMacros`, `TypenameMacros`, `StatementAttributeLikeMacros` | списки макросов util (`Y_UNIT_TEST_SUITE`, `Y_DEFER`, `Y_FORCE_INLINE`, `ythrow` и другие); без util они ни на что не влияют |
| `BasedOnStyle` не задан | всё остальное берётся из стиля LLVM, например `AlignAfterOpenBracket: Align` |

Наблюдение авторов профиля (clang-format 18.1.3): перечисление, записанное в одну строку (`enum class EKind { A, B };`), этот конфиг разбивает на строки с выравниванием по первой константе. Записывайте значения по одному на строку - такой текст форматтер не меняет.

## 4. Именование

Сводка (в опциях clang-tidy `CamelCase` означает PascalCase, а `camelBack` - camelCase с маленькой буквы):

| Что | Форма | Пример | Правило |
|---|---|---|---|
| Класс, структура, объединение, алиас типа | `T` + PascalCase | `TFullModel`, `TNames` | Y-CPP-020 |
| Интерфейс | `I` + PascalCase | `IOutputStream` | Y-CPP-021 |
| Перечисление и его значения | `E` + PascalCase; значения PascalCase | `EStatus::Running` | Y-CPP-022 |
| Пространство имён | `N` + PascalCase | `NStl::NPrivate` | Y-CPP-023 |
| Функция, метод | PascalCase | `GetValue()`, `MakeHolder()` | Y-CPP-024 |
| Поле | PascalCase; `private` и `protected` - с `_` | `Size`, `Member_` | Y-CPP-026 |
| Переменная, параметр | camelCase | `itemCount` | Y-CPP-027 |
| Константа уровня namespace, макрос | `UPPER_CASE` | `TEST_COUNT`, `CB_ENSURE` | Y-CPP-028, Y-CPP-029 |
| Концепт | `C` + PascalCase | `CInputRangeOf` | Y-CPP-033 |
| Файл, каталог | строчные буквы и `_` | `model_serialization_ut.cpp` | Y-CPP-034 |

### Y-CPP-020 · MUST · Классы, структуры, объединения и алиасы типов - префикс `T` и PascalCase
- Проверка: `clang-tidy readability-identifier-naming`: `ClassCase: CamelCase` (дефолт Аркадии); `StructPrefix: T` (опция записана в конфиге YQL); `ClassPrefix: T`, `UnionPrefix: T`, `TypeAliasPrefix: T`, `TypedefPrefix: T` (реконструкция).
- Источник: [гайд, «Capitalization, prefixes, and underscores»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L54) (2026-09-21) · производный гайд проекта · высокая; [гайд YT, «Classes and Structs»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L39) (2026-08-29) · производный гайд проекта · высокая.
- В util есть исторические исключения: класс [`yexception`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/yexception.h#L79) и типы [`ui32`, `i64`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/system/types.h#L21-L30). Новых имён по их образцу не заводят.

### Y-CPP-021 · MUST · Интерфейс - класс хотя бы с одним чисто виртуальным методом и без полей, считая унаследованные, - получает префикс `I` вместо `T`
- Проверка: частично: `clang-tidy readability-identifier-naming.AbstractClassIgnoredRegexp` (реконструкция) допускает имя `I…` только у абстрактного класса; отсутствие полей - ручное ревью.
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L54) (определение интерфейса уточнено [2026-07-18](https://github.com/catboost/catboost/commit/3874f154ccdb464319de129e17c59a9129e52b19)) · производный гайд проекта · высокая.
- Вариант YTsaurus у́же: интерфейс - это [`struct` только с чисто виртуальными методами](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L54). Профиль берёт определение Аркадии.

### Y-CPP-022 · MUST · Перечисления - префикс `E` и PascalCase; значения `enum class` и перечислений внутри класса - PascalCase, значения глобального нескоупного `enum` - `UPPER_CASE` с префиксом из первых букв имени
- Проверка: частично: `clang-tidy readability-identifier-naming`: `EnumPrefix: E` (опция из конфига YQL), `EnumCase: CamelCase`, `ScopedEnumConstantCase: CamelCase` (реконструкция); значения нескоупных перечислений - ручное ревью.
- Источник: [гайд, «Enumerations»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L88-L138) (2026-09-21) · производный гайд проекта · высокая; [гайд YT](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L61-L67) (2026-08-29) · производный гайд проекта · высокая.
- Интерпретация: в новом коде проще объявлять только `enum class` - тогда форма значений одна и совпадает с YTsaurus. Код YDB пишет значения нескоупных перечислений не по гайду (`EvPut`, `TacticMaxThroughput`).

```cpp
enum class EStatus {
    Created,
    Running,
    Finished,
};

enum EFetchType {
    FT_SIMPLE,
    FT_RELFORM_DEBUG,
};
```

### Y-CPP-023 · MUST · Пространства имён - префикс `N` и PascalCase; вложенность не глубже двух уровней
- Проверка: частично: `clang-tidy readability-identifier-naming`: `NamespacePrefix: N` (опция из конфига YQL), `NamespaceCase: CamelCase` (реконструкция); глубина - ручное ревью.
- Источник: [гайд, «Namespaces»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L451-L463) (2026-09-21) · производный гайд проекта · высокая для префикса, средняя для глубины (ограничение записано только комментарием в примере); [гайд YT, «Namespaces»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L127-L139) (2026-08-29) · производный гайд проекта · высокая.

### Y-CPP-024 · MUST · Функции и методы - PascalCase без подчёркиваний и суффиксов при любом уровне доступа
- Проверка: `clang-tidy readability-identifier-naming`: `FunctionCase: CamelCase`, `ClassMethodCase: CamelCase` (дефолт Аркадии); `PublicMethodCase: CamelCase`, `MethodCase: CamelCase` (реконструкция: дефолт Аркадии регистр публичных нестатических методов не проверяет).
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L42-L52) (2026-09-21) · производный гайд проекта · высокая; [config.yaml Аркадии, L23-L29](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/clang_tidy/config.yaml#L23-L29) (2026-05-22) · конфиг или инструмент · высокая.

### Y-CPP-025 · SHOULD · Имя функции начинается с глагола: простой геттер - `GetX()`, вычисление - `CountX()`; переменные-контейнеры называются во множественном числе
- Проверка: ручное ревью.
- Источник: [гайд, «Semantics and pragmatics of naming»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L146-L151) (2026-09-21) · производный гайд проекта · высокая; [дополнения CatBoost, п. 5](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L6-L7) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Противоречие: в util новый код [обязан](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L23) называть аксессоры без `Get` (`Length()`, а не `GetLength()`). Профиль берёт вариант с `Get`, потому что его называют общий гайд и CatBoost. Для счётчиков гайд советует `NumDocs` или `DocCount` и запрещает `DocNum`, `DocsCount`, `CountDoc`.

### Y-CPP-026 · MUST · Поля - PascalCase; `private` и `protected` поля заканчиваются на `_`, `public` - нет
- Проверка: `clang-tidy readability-identifier-naming`: `PublicMemberCase`, `ProtectedMemberCase`, `PrivateMemberCase: CamelCase`, `ProtectedMemberSuffix: _`, `PrivateMemberSuffix: _` (дефолт Аркадии). Статические поля конфиг профиля не проверяет.
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L50) (правило о `_` добавлено [2026-07-18](https://github.com/catboost/catboost/commit/3874f154ccdb464319de129e17c59a9129e52b19)) · производный гайд проекта · высокая; [config.yaml Аркадии, L13-L22](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/clang_tidy/config.yaml#L13-L22) (2026-05-22) · конфиг или инструмент · высокая.
- Спорный пункт: гайд, инструмент и YTsaurus требуют `_`, но основной код YDB и CatBoost написан без него (см. [подсчёты в разделе 2](#2-соглашения-аркадии-в-открытом-коде-что-подтверждается)). Для нового репозитория правило выполнимо без оговорок; в существующем файле действует Y-CPP-068.

```cpp
struct TOptions {
    int ThreadCount = 1;
};

class TRunner {
private:
    TOptions Options_;
};
```

### Y-CPP-027 · MUST · Локальные и глобальные переменные, параметры функций и захваты лямбд пишутся с маленькой буквы в camelCase; переменная, хранящая лямбду, - тоже
- Проверка: `clang-tidy readability-identifier-naming`: `LocalVariableCase: camelBack`, `ParameterCase: camelBack`, `GlobalVariableCase: camelBack` (реконструкция; дефолт Аркадии этого не проверяет).
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L40-L48) (2026-09-21) · производный гайд проекта · высокая; [гайд YT](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L113) (2026-08-29) · производный гайд проекта · высокая.
- Статические локальные переменные: гайд YTsaurus и конфиг YQL (`StaticVariableCase: CamelCase`) пишут их с заглавной буквы, аркадийный гайд отдельно их не оговаривает. Конфиг профиля следует YQL; как отключить - сказано в комментарии к опции.

### Y-CPP-028 · MUST · Константы уровня namespace и макросы - `UPPER_CASE` со словами через подчёркивание
- Проверка: `clang-tidy readability-identifier-naming`: `MacroDefinitionCase: UPPER_CASE` (дефолт Аркадии), `GlobalConstantCase: UPPER_CASE` (реконструкция). Константы-члены классов не проверяются.
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L56-L58) (2026-09-21) · производный гайд проекта · средняя; [config.yaml Аркадии, L33-L36](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/clang_tidy/config.yaml#L33-L36) (2026-05-22) · конфиг или инструмент · высокая.
- Спорный пункт: норму гайда соблюдают util и CatBoost, а YDB и YTsaurus пишут такие константы в PascalCase - YTsaurus по [собственному гайду](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L94). Профиль берёт `UPPER_CASE`, потому что так записано в обеих редакциях аркадийного гайда (CatBoost и [YDB](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L25)). Константа-член класса по гайду называется как прочие члены класса, то есть в PascalCase. Команде, выбравшей вариант YDB и YTsaurus, достаточно заменить значение `GlobalConstantCase` на `CamelCase`.

### Y-CPP-029 · MUST · Имя макроса уникально; макрос публичного API библиотеки несёт префикс проекта (в Аркадии - `Y_`)
- Проверка: ручное ревью.
- Источник: [гайд, «Macros»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L84) (2026-09-21) · производный гайд проекта · высокая.
- Интерпретация: гайд называет только префикс `Y_` и только для Аркадии. Замена его на префикс своего проекта - перенос по образцу CatBoost ([`CB_ENSURE`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/helpers/exception.h#L15)) и YTsaurus ([`YT_VERIFY`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/assert/assert.h#L68)).

### Y-CPP-030 · MUST · Имя не начинается с подчёркивания; венгерская нотация запрещена
- Проверка: ручное ревью. Стоковая проверка `bugprone-reserved-identifier` в конфиг профиля не включена: в конфиге YQL она выключена.
- Источник: [гайд](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L60-L62) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-031 · MUST · В именах допустимы только общепринятые сокращения; однобуквенные имена - только счётчики и итераторы `i`, `j`, `k`
- Проверка: ручное ревью.
- Источник: [гайд, «Names»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L34) (2026-09-21) · производный гайд проекта · высокая; [дополнения CatBoost, пп. 2-4](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L3-L5) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Аббревиатуры: CatBoost пишет их как слова (`TDsvWriter`, а не `TDSVWriter`). YTsaurus делает исключение для двухбуквенных (`TIOTracker`, но `TTcpConnection`) и не одобряет даже счётчик `i` - [гайд YT, «Naming Conventions»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L611-L642). Профиль берёт вариант CatBoost.

### Y-CPP-032 · SHOULD · Имена, которых ждёт внешний код (`begin`, `end`, `size`, `data`, `swap`, `value_type`), сохраняют его написание
- Проверка: `clang-tidy readability-identifier-naming`: `PublicMethodIgnoredRegexp` и `FunctionIgnoredRegexp` (дефолт Аркадии, расширены на `data` и `swap`), `TypeAliasIgnoredRegexp`, `TypedefIgnoredRegexp` (реконструкция).
- Источник: [гайд, исключение из правил именования](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L77-L80) (2026-09-21) · производный гайд проекта · высокая; [config.yaml Аркадии, L30-L32](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/clang_tidy/config.yaml#L30-L32) (2026-05-22) · конфиг или инструмент · высокая.
- Уровень: гайд это разрешает, а не требует, поэтому SHOULD. Это единственное исключение из правил именования.

### Y-CPP-033 · SHOULD · Концепты - префикс `C` и PascalCase
- Проверка: `clang-tidy readability-identifier-naming`: `ConceptCase: CamelCase`, `ConceptPrefix: C` (реконструкция).
- Источник: [`CInputRangeOf` в util](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ranges.h#L13), [`CFuture` в YTsaurus](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/future.h#L880) (код на 2026-10-09) · практика, выведенная из репозиториев (2 из 4 кодовых баз, где концепты проверены: util и YTsaurus; в YDB - префикс `T`, в userver - без префикса) · низкая · реконструкция.
- В публичных гайдах правила о концептах нет.

### Y-CPP-034 · MUST · Имена файлов - строчными буквами, слова через `_`, без сокращений; расширения - `.h` и `.cpp`; каталоги называются так же
- Проверка: ручное ревью.
- Источник: [гайд, «File names»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L551) (2026-09-21) · производный гайд проекта · высокая; [дополнения CatBoost, п. 6](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L8) (не обновляется с 2023-12-01) · производный гайд проекта · средняя. Для каталогов письменного правила нет: это практика, выведенная из репозиториев (наблюдение без подсчёта доли, например [`table_client`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/client/table_client/public.h#L89-L91), [`model_interface`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model_interface/c_api.h#L1-L59)) · низкая · реконструкция.
- Варианты: YTsaurus выносит реализацию шаблонов в файлы `*-inl.h`; userver использует расширение `.hpp`.

О шаблонных параметрах публичного правила нет. В коде встречаются и одиночные буквы (`T`, `D`), и имена с `T` (`TKey`, `TValue`, `TAllocParam`); объявляют их через `class`, а не `typename`. Конфиг профиля проверяет только регистр (`TypeTemplateParameterCase: CamelCase`).

## 5. Структура файлов и порядок include

### Y-CPP-035 · MUST · Заголовок защищается от повторного включения директивой `#pragma once` в первой строке
- Проверка: ручное ревью. В Аркадии строку дописывает сам [`ya style`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/devtools/ya/handlers/style/styler.py#L430-L441); стоковой проверки в clang-format и clang-tidy нет.
- Источник: [гайд, «include»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L644-L649) (2026-09-21) · производный гайд проекта · высокая; [гайд YT, «Include Guards»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L197) (2026-08-29) · производный гайд проекта · высокая.
- По коду: `#pragma once` стоит первой строкой в 188 из 189 заголовков `util`, 78 из 78 в `ydb/core/base`, 83 из 83 в `catboost/libs`, 187 из 187 в `userver/core/include`. В `yt/yt/core` - 145 из 208: остальные - файлы `*-inl.h`, которые YTsaurus [защищает макросом](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L249-L283).

### Y-CPP-036 · SHOULD · В файлах собственного кода нет лицензионной шапки и сведений об авторе; лицензия лежит одним файлом `LICENSE` в корне репозитория
- Проверка: ручное ревью.
- Источник: первые строки заголовков [ptr.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L1), [invoker.h](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/actions/invoker.h#L1), [mutex.hpp](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L1) (код на 2026-10-09) · практика, выведенная из репозиториев (5 из 5 кодовых баз; строк с `copyright`, `licensed under` или `SPDX` в первых пяти строках файла - 2 в `util`, обе в сторонних вставках, и 0 в остальных выборках) · высокая · реконструкция.
- Письменного правила «не ставить заголовок» нет: публичных данных не найдено, это наблюдение по коду. Косвенное подтверждение: `ya style` [пропускает](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/library/python/testing/style/rules.py#L23-L50) файлы со строками `THIS SOFTWARE` и `WITHOUT WARRANT`, то есть считает текст лицензии признаком чужого кода.

### Y-CPP-037 · MUST · Заголовок самодостаточен: компилируется как отдельная единица трансляции
- Проверка: ручное ревью; косвенно - сборка парного `.cpp` (Y-CPP-038).
- Источник: [гайд, «include»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L585-L589) (2026-09-21) · производный гайд проекта · высокая.
- Как добиться: для стандартного типа - минимальный стандартный заголовок (`<cstddef>`); для класса, структуры или перечисления, используемых по ссылке или указателю, - предварительное объявление прямо в заголовке; в остальных случаях - include файла с определением.
- Варианты: YTsaurus [предпочитает](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L407) предварительные объявления и собирает их в `public.h` и `private.h` каталога; userver, наоборот, [просит](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md#L43) не полагаться на транзитивные include и включать всё используемое.

### Y-CPP-038 · SHOULD · У каждого `.h` есть парный `.cpp`, даже если весь код лежит в заголовке; `.cpp` первым включает свой заголовок
- Проверка: ручное ревью.
- Источник: [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L8) (2025-11-06) · производный гайд проекта · высокая; [дополнения CatBoost, п. 14](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L36) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Уровень: в util и в команде CatBoost это обязательно, но в общем гайде правила нет, поэтому SHOULD. Смысл - компилятор проверяет самодостаточность заголовка при каждой сборке.

### Y-CPP-039 · MUST · Порядок `#include` - от частного к общему: парный заголовок, локальные файлы, каталоги проекта по вложенности, сторонние библиотеки, базовая библиотека проекта, стандартная библиотека, системные заголовки
- Проверка: ручное ревью. `clang-format: SortIncludes: false` - дефолтный конфиг намеренно не трогает include.
- Источник: [гайд, «include»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L595-L642) (2026-09-21) · производный гайд проекта · высокая; [гайд YT, «Include Directives»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L203-L243) (2026-08-29) · производный гайд проекта · высокая; [YDB CODESTYLE.md, «Include order»](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L267-L279) (2026-07-20) · производный гайд проекта · высокая.
- Детали: парный заголовок и файлы своего каталога - в кавычках, всё остальное - в угловых скобках; группы разделяются пустой строкой; внутри группы желателен алфавитный порядок. Порядок «от частного к общему» ещё раз проверяет независимость заголовков.
- Варианты: в гайде CatBoost `util` идёт после сторонних библиотек, в редакции YDB - перед ними; у userver стандартная библиотека подключается [раньше](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L6-L11) своих заголовков. Команда YDB columnshard выразила свой порядок через `IncludeCategories` в [локальном .clang-format](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/tx/columnshard/.clang-format); профиль этого не делает, потому что дефолт Аркадии сортировку выключает.
- Пример: составлен авторами профиля по образцу гайда (на месте `util` - базовая библиотека своего проекта, здесь `myproject/base`):

```cpp
#include "some_class.h"

#include "other_class.h"

#include <myproject/json/json_reader.h>

#include <rapidjson/reader.h>

#include <myproject/base/string_utils.h>

#include <cmath>
#include <vector>
```

### Y-CPP-040 · MUST · `using namespace` на глобальном уровне заголовка запрещён; исключение - литералы стандартной библиотеки
- Проверка: `clang-tidy google-global-names-in-headers` (проверка включена в конфиге YT Flow; заголовки проверяются только при заданном `HeaderFilterRegex`). Проверка строже гайда: срабатывает и на `using namespace std::literals`, и на `using std::string;` - разрешённый гайдом случай подавляется комментарием `// NOLINT(google-global-names-in-headers)`.
- Источник: [гайд, «include»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L591-L592) (уточнено [2026-09-21](https://github.com/catboost/catboost/commit/7ab6691f)) · производный гайд проекта · высокая; [yt/yt/flow/.clang-tidy](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/flow/.clang-tidy) (2026-07-14) · конфиг или инструмент · высокая.

### Y-CPP-041 · SHOULD · Сущности, нужные только в одном `.cpp`, получают внутреннюю линковку: классы - в анонимном пространстве имён, функции - `static`
- Проверка: ручное ревью.
- Источник: [дополнения CatBoost, п. 1](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L2) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Вариант: конфиг YQL включает проверку [`misc-use-anonymous-namespace`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy), которая просит и функции переносить из `static` в анонимное пространство имён. В конфиг профиля она не включена: расходится с формулировкой CatBoost.

### Y-CPP-042 · MUST · `struct` содержит только публичные поля, конструктор и деструктор; тип с приватными членами или методами оформляется как `class`
- Проверка: ручное ревью.
- Источник: [гайд, «Class and structure definitions»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L376) (2026-09-21) · производный гайд проекта · высокая; [гайд YT, «Classes and Structs»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L52) (2026-08-29) · производный гайд проекта · высокая.
- В гайде первая половина сформулирована жёстко, вторая - как рекомендация переименовать `struct` в `class`. Спецификатор `public:` в структуре не пишут.

## 6. Комментарии и документирование

### Y-CPP-043 · MUST · Комментарии пишутся через `//` с одним пробелом после и на грамотном английском
- Проверка: частично: `clang-format: SpacesInLineCommentPrefix: {Minimum: 1, Maximum: 1}`; язык и содержание - ручное ревью.
- Источник: [гайд, «Comments»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L513-L530) (2026-09-21) · производный гайд проекта · высокая; [.clang-format Аркадии, L111-L113](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/config/tests/cpp_style/.clang-format#L111-L113) (значение с [2024-08-19](https://github.com/yandex/yatool/commit/dbc30357a)) · конфиг или инструмент · высокая.
- Варианты: редакция YDB [допускает](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L313-L314) русский язык (предпочтителен английский); YTsaurus [требует](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L782) полных предложений с заглавной буквы и с точкой и не использует `/* */`.

### Y-CPP-044 · MUST · Ненужный код удаляют, а не комментируют
- Проверка: ручное ревью.
- Источник: [гайд, «Comments»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L513) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-045 · SHOULD · Документирующие комментарии пишутся в стиле Doxygen; назначение членов класса поясняется в его описании
- Проверка: ручное ревью.
- Источник: [гайд, «Comments»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L532-L534) (2026-09-21) · производный гайд проекта · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L22) (2025-11-06; для нового кода util такие комментарии обязательны) · производный гайд проекта · высокая.
- Варианты: YTsaurus пишет `//!`, параметры в тексте выделяет как `|parameter|`, сущности - как `#TClass` ([гайд YT](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L794)); userver пишет `///` с тегами `@file`, `@brief`, `@see` ([mutex.hpp](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L3-L27)) и при этом [запрещает](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md#L22-L26) ИИ-агентам добавлять обычные комментарии в продакшен-код. Какие теги Doxygen обязательны, ни один источник не говорит.

### Y-CPP-046 · SHOULD · TODO оформляется как `// TODO (username): …` или `// TODO (ticket): …`
- Проверка: ручное ревью.
- Источник: [гайд, «Comments»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L536-L545) (2026-09-21) · производный гайд проекта · высокая.
- Уровень: формат в двух редакциях разный - YDB пишет без пробела, [`// TODO(username):`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L316-L321), - поэтому SHOULD; внутри одного репозитория форма должна быть одна. Python-профиль (Y-PY-024 в [python.md](python.md)) берёт форму без пробела `# TODO(login):` по коду YTsaurus; в репозитории с двумя языками достаточно одной формы на язык.

### Y-CPP-047 · SHOULD · Неочевидный аргумент вызова - литерал `true` или `false`, «магическая» константа - помечается именем параметра: `/*name*/ value`
- Проверка: частично: `clang-tidy bugprone-argument-comment` с опциями `CommentBoolLiterals: true` и `IgnoreSingleArgument: true` (проверка и опции взяты из конфига YQL) требует комментарий у bool-литерала в вызове с двумя и более аргументами; имя параметра сверяется только в форме `/*name=*/`; прочие константы - ручное ревью.
- Источник: [дополнения CatBoost, п. 15](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L37-L40) (не обновляется с 2023-12-01; «рекомендуется») · производный гайд проекта · средняя; [гайд YT, «Misc»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L862-L870) (2026-08-29; «must») · производный гайд проекта · высокая; [yql/essentials/.clang-tidy](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy) (2026-10-05) · конфиг или инструмент · высокая.
- Уровень: аркадийный источник рекомендует, YTsaurus требует; профиль берёт уровень аркадийного источника.

```cpp
// плохо
MySort(true, &container);

// хорошо
MySort(/*useParallelImplementation*/ true, &container);
```

## 7. Обработка ошибок, логирование, типы

Исключения разрешены и включены при сборке во всех пяти кодовых базах; в сборке ya флаг `-fexceptions` снимается только явным `NO_CXX_EXCEPTIONS`, а RTTI отключается только явным `NO_CXX_RTTI` ([ymake_conf.py](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/ymake_conf.py#L1581-L1591)).

### Y-CPP-048 · MUST · Об ошибках времени выполнения сообщают исключениями; коды возврата допустимы только в C-коде, при обработке результатов C-функций и в местах, где доказана критичность для производительности
- Проверка: ручное ревью.
- Источник: [гайд, «Error handling»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L655-L684) (2026-09-21) · производный гайд проекта · высокая.
- Пример: допустимое исключение из правила - C API CatBoost: функции [возвращают `bool`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model_interface/c_api.h#L76-L92), а текст ошибки отдаёт `GetErrorString()`.

### Y-CPP-049 · SHOULD · Исключения проекта наследуются от одного базового класса проекта; текст ошибки собирается в месте броска
- Проверка: ручное ревью.
- Источник: [гайд, «Run-time errors»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L655-L668) (2026-09-21) · производный гайд проекта · высокая; код: [`TCatBoostException`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/helpers/exception.h#L5-L15), [`TErrorException` в YTsaurus](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/error/error.h#L355-L356), [исключения userver](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/universal/include/userver/utils/traceful_exception.hpp#L70) (на 2026-10-09) · практика, выведенная из репозиториев (3 из 3 проверенных проектов: CatBoost, YTsaurus, userver) · средняя · реконструкция.
- В Аркадии базовый класс - `yexception`, бросают макросом `ythrow`, который добавляет место в коде. Вне Аркадии `yexception` недоступен; базовый класс проекта наследуют от `std::exception`, как сделано в YTsaurus и userver.

### Y-CPP-050 · MUST · Инварианты времени компиляции проверяются `static_assert`, инварианты времени выполнения - макросом проверки проекта, а не `assert()`
- Проверка: ручное ревью.
- Источник: [гайд, «Invariant verification»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L688) (2026-09-21) · производный гайд проекта · высокая.
- Макросы по проектам: в Аркадии [`Y_ASSERT`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/system/yassert.h#L80-L104) (только в отладочной сборке) и `Y_ABORT_UNLESS` (всегда); в YTsaurus - [`YT_ASSERT` и `YT_VERIFY`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/library/cpp/yt/assert/assert.h#L50-L102); в userver - [`UASSERT` и `UINVARIANT`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/universal/include/userver/utils/assert.hpp#L56-L77). Интерпретация: вне Аркадии заводят свой макрос с префиксом проекта (Y-CPP-029).

### Y-CPP-051 · SHOULD · Серверный код не завершает процесс там, где можно вернуть ошибку: вместо abort-макросов - исключение или ответ с ошибкой
- Проверка: ручное ревью; в источнике это прямо записано как пункт ревью.
- Источник: [YDB NO_ABORT.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/NO_ABORT.md#L3-L11) (2026-07-29; инструкция для ИИ-агентов) · производный гайд проекта · средняя.
- Уровень: в YDB - «Never», но это правило одного проекта, и существующий код его не соблюдает (в `ydb/core/base` 120 вызовов `Y_ABORT_UNLESS(`), поэтому SHOULD. Проверки, работающие только в отладочной сборке, разрешены.

### Y-CPP-052 · SHOULD · В лог пишут только через макросы логгера проекта; сообщение - не законченное предложение и без точки, переменные части - в скобках парами `Key: value`
- Проверка: ручное ревью.
- Источник: [гайд YT, «Logging»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L536-L577) (2026-08-29) · производный гайд проекта · средняя.
- Это правило YTsaurus. В аркадийном гайде о логировании ничего нет - публичных данных не найдено; YDB пользуется макросами `LOG_*_S`, `AFL_*`, `YDB_LOG_*` без письменного правила выбора, userver - потоковыми `LOG_WARNING() << …`. Профиль берёт формат YTsaurus как единственный записанный. Там же - правило о текстах ошибок: их пишут для конечного пользователя, грамотным английским, без точек; переменные части входят прямо в текст, машинно-читаемые подробности - в атрибуты ошибки ([«Errors»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L579-L599)).

```cpp
// плохо
YT_LOG_DEBUG("Fetched %v tables", tableCount);

// хорошо
YT_LOG_DEBUG("Tables fetched (TableCount: %v)", tableCount);
```

### Y-CPP-053 · SHOULD · Владение выражается умным указателем, единоличное предпочтительнее разделяемого; сырой указатель - только невладеющая ссылка
- Проверка: ручное ревью.
- Источник: [гайд YT, «Raw/Intrusive/Weak/Unique/Shared Ptrs»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L444-L483) (2026-08-29) · производный гайд проекта · средняя; [userver AGENTS.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md#L39-L42) (2026-10-07; инструкция для ИИ-агентов) · производный гайд проекта · средняя · реконструкция.
- В аркадийном гайде о выборе указателей нет ничего, кроме «`new`, а не `malloc`»; о выборе между `THolder` и `std::unique_ptr` публичных данных не найдено. Правило собрано из двух проектных текстов.

### Y-CPP-054 · SHOULD · `auto` используют для локальных переменных, но не для полей, параметров, возвращаемых типов и коротких примитивных типов (`int`, `bool`, `char`)
- Проверка: ручное ревью.
- Источник: [гайд YT, «auto vs Explicit Types»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L351-L388) (2026-08-29) · производный гайд проекта · средняя.
- Это правило YTsaurus; в аркадийном гайде про `auto` публичных данных не найдено.

### Y-CPP-055 · SHOULD · Параметры идут в порядке «входные, изменяемые, выходные»; изменяемые и выходные передаются по указателю
- Проверка: ручное ревью.
- Источник: [дополнения CatBoost, п. 8](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L13-L16) (не обновляется с 2023-12-01) · производный гайд проекта · средняя.
- Уровень: в источнике «обязательно», но это правило одной команды в необновляемом документе, поэтому SHOULD.

```cpp
void Normalize(const TOptions& options, std::vector<double>* weights, TStats* stats);
```

### Целые типы: единой позиции нет

Правила в профиле нет, потому что два источника требуют противоположного:

- [Дополнения CatBoost, п. 13](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost_command_style_guide_extension.md#L35) (не обновляется с 2023-12-01): для размеров и индексов - беззнаковые типы фиксированного размера, по умолчанию `ui64`, потому что данные бывают большими.
- [Гайд YT, «Integer types»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L293-L345): по умолчанию `int`; когда важна разрядность - `i8`…`i64` и `ui8`…`ui64`; `long`, `short`, `int8_t` и подобные не используются; знаковые предпочтительнее, беззнаковые - только для битовых операций и протоколов. Гайд прямо ссылается на раздел Integer Types гайда Google.

Выберите один вариант для проекта и запишите его в `CONTRIBUTING`. Для ML-кода профиль уже выбрал первый вариант - Y-ML-018 в [../ml/project-structure.md](../ml/project-structure.md) (беззнаковые 64-битные для размеров, по дополнениям CatBoost).

### RTTI и `noexcept`

- RTTI: письменного правила нет - публичных данных не найдено. В сборке ya RTTI включён по умолчанию, `dynamic_cast` в коде встречается ([model.cpp](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model/model.cpp#L138)); в дефолтный clang-tidy Аркадии включена собственная проверка `arcadia-typeid-name-restriction`, код и описание которой не опубликованы.
- `noexcept`: пишут `noexcept`, а не `throw()`; для деструкторов он не обязателен ([util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L15)). Общей политики расстановки `noexcept` в публичных источниках нет.

### Библиотека: что принято в Аркадии и что брать вне её

Аркадийный стиль в части библиотеки привязан к `util` и к сборке ya. Вне Аркадии эти типы недоступны, поэтому таблица справочная; правый столбец - не Яндекс.

| Задача | Аркадия (util, CatBoost, YDB) | YTsaurus | userver | Вне Аркадии (не Яндекс) |
|---|---|---|---|---|
| Строки, контейнеры, `optional` | `TString`, `TVector`, `THashMap`, `TMaybe` | в core - `std::string`, `std::vector`, `std::optional` | `std::` | `std::` |
| Владение | [`THolder`, `MakeHolder`, `TIntrusivePtr`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/ptr.h#L265) | `TIntrusivePtr` и `New<T>()`, `std::unique_ptr` | `std::unique_ptr` | `std::unique_ptr`, `std::shared_ptr` |
| Исключения | `yexception`, `ythrow`, `Y_ENSURE` | `TError`, `THROW_ERROR_EXCEPTION` | наследники `std::exception` | свой базовый класс от `std::exception` |
| Инварианты | `Y_ASSERT`, `Y_ABORT_UNLESS` | `YT_ASSERT`, `YT_VERIFY` | `UASSERT`, `UINVARIANT` | свой макрос с префиксом проекта |
| Целые фиксированной ширины | `i32`, `ui64` | `i64`, `ui64` | - | типы `<cstdint>` |
| Преобразование enum в строку | `GENERATE_ENUM_SERIALIZATION` - писать своё [запрещено](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L140-L142) | `DEFINE_ENUM` | - | своя кодогенерация или библиотека |

Направление 2024-2026 годов - сближение со стандартной библиотекой: 2026-07-15 из гайда [убрали](https://github.com/catboost/catboost/commit/edafc7519f6c4214b4599acde654d0800aea4298) пример замены `std::string` на `TString`; в [`yt/yt/core/misc`](https://github.com/ytsaurus/ytsaurus/tree/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc) `std::vector<` встречается 463 раза, а `TVector<` - ни разу; C++ SDK YDB написан на `std::`. В [`catboost/libs/model`](https://github.com/catboost/catboost/tree/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model) пока наоборот: 511 `TVector<` против 53 `std::vector<`.

### Код инференса и C API

Отдельного публичного гайда по C++-коду инференса нет: на код CatBoost действует общий гайд плюс требование, чтобы CUDA-совместимый код собирался под C++17 или C++20. По коду видны приёмы (наблюдения, не правила): граница на C с непрозрачными хэндлами, результатом `bool` и потоко-локальной строкой ошибки ([c_api.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/model_interface/c_api.h#L1-L59)); автономный вычислитель без типов util, на `std::string` и `std::vector` ([evaluator.h](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/libs/standalone_evaluator/evaluator.h#L8-L53)); сгенерированный C++-код модели [компилируется в тестах](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/docs/en/concepts/development-and-contributions.md#L113) настоящим компилятором.

## 8. Запрещённые и ограниченные возможности языка

### Y-CPP-056 · MUST · Нулевой указатель записывается как `nullptr`, а не `0` или `NULL`
- Проверка: `clang-tidy modernize-use-nullptr` (включена в конфигах YQL и YT Flow).
- Источник: [гайд, «nullptr/0/NULL»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L479-L481) (2026-09-21) · производный гайд проекта · высокая; [yql/essentials/.clang-tidy](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy) (2026-10-05) · конфиг или инструмент · высокая.

### Y-CPP-057 · MUST · В наследнике переопределённый метод помечается `override` без `virtual`
- Проверка: `clang-tidy modernize-use-override` (включена в конфигах YQL и YT Flow).
- Источник: [гайд, «override»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L496-L509) (2026-09-21) · производный гайд проекта · высокая; [yql/essentials/.clang-tidy](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy) (2026-10-05) · конфиг или инструмент · высокая.

### Y-CPP-058 · SHOULD · Алиасы типов объявляются через `using`, а не `typedef`
- Проверка: `clang-tidy modernize-use-using` (включена в конфиге YQL).
- Источник: [гайд, «using/typedef»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L483-L494) (2026-09-21) · производный гайд проекта · высокая; [yql/essentials/.clang-tidy](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/.clang-tidy) (2026-10-05) · конфиг или инструмент · высокая.

### Y-CPP-059 · MUST · Завершающий возвращаемый тип (`auto f() -> T`) и вывод типа результата применяются только там, где без них не обойтись
- Проверка: ручное ревью.
- Источник: [гайд, «Alternative function syntax»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L468-L477) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-060 · MUST · C++ используется как императивный объектно-ориентированный язык: без приёмов «чистого C» (`new`, а не `malloc`), без вычислений на шаблонах, с range-based `for` вместо `for_each`
- Проверка: ручное ревью.
- Источник: [гайд, «Background»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L9-L14) (2026-09-21) · производный гайд проекта · высокая; [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L9) (2025-11-06) · производный гайд проекта · высокая.
- В util дополнительно запрещены `printf`-подобные функции. Оператор `new` считается бросающим исключение, проверять результат на ноль не нужно.

### Y-CPP-061 · MUST · Boost не используется
- Проверка: ручное ревью.
- Источник: [гайд, «Background»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L15) (2026-09-21) · производный гайд проекта · высокая.
- Вторая половина того же пункта гайда - ограничивать STL там, где в `util` есть оптимизированный аналог (потоки ввода-вывода), - вне Аркадии невыполнима и в профиль не входит: см. таблицу в [разделе 7](#библиотека-что-принято-в-аркадии-и-что-брать-вне-её).

### Y-CPP-062 · SHOULD · Препроцессор применяется только там, где не справляются шаблоны, `if constexpr` и виртуальные функции
- Проверка: ручное ревью.
- Источник: [гайд, «Preprocessor»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L581) (2026-09-21) · производный гайд проекта · высокая.

### Y-CPP-063 · MUST · Платформозависимые системные вызовы живут только в слое кроссплатформенных обёрток (в Аркадии - `/util`)
- Проверка: ручное ревью.
- Источник: [гайд, «Cross-platform wrappers»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L692) (2026-09-21) · производный гайд проекта · высокая.
- Интерпретация: гайд называет только `/util`; «один каталог обёрток в своём проекте» - перенос правила на обычный репозиторий.

## 9. Тесты

Ни аркадийный гайд, ни гайд YTsaurus раздела о тестах не содержат; правила ниже взяты из README util, инструкций для ИИ-агентов и из кода.

| | Аркадия (util, CatBoost, YDB) | YTsaurus | userver |
|---|---|---|---|
| Фреймворк | свой: `library/cpp/testing/unittest` - [`Y_UNIT_TEST_SUITE`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/library/cpp/testing/unittest/registar.h#L1069), [`Y_UNIT_TEST`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/library/cpp/testing/unittest/registar.h#L1136), `UNIT_ASSERT*`; YDB допускает и `GTEST()` | GoogleTest через [обёртку](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/test_framework/framework.h#L10) | GoogleTest с макросом `UTEST` |
| Файлы | `*_ut.cpp`: в util - рядом с кодом, в CatBoost и YDB - в `ut/` | `unittests/*_ut.cpp` | `*_test.cpp`, бенчмарки - `*_benchmark.cpp` |
| Имена | [`Y_UNIT_TEST_SUITE(TMaybeTest)`, `Y_UNIT_TEST(TestStatic)`](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/generic/maybe_ut.cpp#L23-L24) | [`TEST(TChecksumTest, TestStreams)`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/misc/unittests/checksum_ut.cpp#L65) | [`UTEST(SayHelloTo, Basic)`](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/samples/hello_service/unittests/say_hello_test.cpp#L4-L6) |

### Y-CPP-064 · MUST · Новая функциональность и исправления ошибок сопровождаются юнит-тестами
- Проверка: ручное ревью; CI запускает тесты, но не проверяет, что они добавлены.
- Источник: [util/README.md](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/util/README.md#L19-L21) (2025-11-06) · производный гайд проекта · высокая; [userver AGENTS.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md#L52) (2026-10-07; инструкция для ИИ-агентов) · производный гайд проекта · средняя.
- Требований к проценту покрытия ни один источник не задаёт.

### Y-CPP-065 · SHOULD · Тесты лежат в файлах `*_ut.cpp` в подкаталоге `ut/` рядом с проверяемым кодом
- Проверка: ручное ревью.
- Источник: [YDB TESTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/TESTS.md#L7-L11) (2026-09-09; инструкция для ИИ-агентов) · производный гайд проекта · высокая; [документация CatBoost](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/docs/en/concepts/development-and-contributions.md#L17) (состояние на 2026-10-09) · производный гайд проекта · высокая. Суффикс `_ut.cpp` - практика, выведенная из репозиториев (4 из 5 кодовых баз: util, CatBoost, YDB, YTsaurus; у userver - `_test.cpp`) · высокая.
- Уровень: общего правила нет, раскладка различается (util - рядом с кодом, YTsaurus - `unittests/`), поэтому SHOULD.

### Y-CPP-066 · SHOULD · Вне Аркадии тесты пишутся на GoogleTest
- Проверка: ручное ревью (сборка тестовой цели в CI).
- Источник: [обёртка тестов YTsaurus](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/core/test_framework/framework.h#L10), [`UTEST` в userver](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/samples/hello_service/unittests/say_hello_test.cpp#L4-L6), [`GTEST()` в YDB TESTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/TESTS.md#L7-L11) (на 2026-10-09) · практика, выведенная из репозиториев (GoogleTest есть в 3 из 5 кодовых баз: YTsaurus, userver и, наряду с unittest, YDB) · средняя · реконструкция.
- Собственный фреймворк Аркадии работает только внутри сборки ya, поэтому для обычного репозитория остаётся GoogleTest. Наборы тестов в коде util и YTsaurus называются `T<Имя>Test`; письменного правила об именах тестов нет.

```cpp
// ut/lru_cache_ut.cpp
#include <cache/lru_cache.h>

#include <gtest/gtest.h>

TEST(TLruCacheTest, ReturnsNothingForMissingKey) {
    NSample::TLruCache cache(NSample::TCacheOptions{});
    EXPECT_FALSE(cache.Find("missing"));
}
```

## 10. Стандарт языка и изменения за 2024-2026 годы

### Y-CPP-067 · MUST · Код компилируется как C++20
- Проверка: сборка - `-std=c++20` или `set(CMAKE_CXX_STANDARD 20)`; в форматтере - `clang-format: Standard: c++20`.
- Источник: [гайд, «Background»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L10) (2026-09-21; до [2026-07-17](https://github.com/catboost/catboost/commit/dc9a7195613be3e1fa844344eb0e50ed33cc660f) гайд называл C++14) · производный гайд проекта · высокая; [значение по умолчанию в сборке ya](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/ymake_conf.py#L1091) (состояние на 2026-10-09) · конфиг или инструмент · высокая; [гайд YT, «General»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L27) (2026-08-29) · производный гайд проекта · высокая.
- Исключение гайда: CUDA-совместимый код должен собираться под C++17 или C++20.

| Проект | Стандарт | Компиляторы | Источник |
|---|---|---|---|
| Сборка ya (Аркадия) | `c++20` по умолчанию | тулчейн скачивает сам ya | [ymake_conf.py](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/ymake_conf.py#L1091) |
| CatBoost | C++20; CUDA-код - C++17 или C++20 | в сборке CMake на Linux - clang 18.x-22.x | [CMakeLists.txt](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CMakeLists.txt#L30), [документация](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/docs/en/installation/build-environment-setup-for-cmake.md#L62-L68) |
| YDB | «C++20 or earlier»; сборка только через yatool | публичных данных не найдено | [AGENTS.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/AGENTS.md#L29), [BUILD.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/BUILD.md) |
| YTsaurus | C++20, заявлен переход на C++23 | clang-20, плюс LLVM 18 для биткода | [гайд YT](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L27), [BUILD.md](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/BUILD.md#L13-L28) |
| userver | C++20 и C++23 | GCC ≥ 11.2, Clang ≥ 16 | [supported_platforms.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/scripts/docs/en/userver/supported_platforms.md#L11-L12) |

Что менялось (по истории git открытых репозиториев; глубже 2023-2024 годов история не просматривалась):

| Дата | Изменение | Где |
|---|---|---|
| 2024-04-04 | `ya style` и стилевые тесты переведены на один конфиг; он стал требовать clang-format 16 или новее | [yatool](https://github.com/yandex/yatool/commit/4b8919c0e) |
| 2024-06-03 | `PackConstructorInitializers: Never` | [yatool](https://github.com/yandex/yatool/commit/2e5f3bcb5) |
| 2024-08-19 | ровно один пробел после `//` | [yatool](https://github.com/yandex/yatool/commit/dbc30357a) |
| 2024-09-05 | обязательный комментарий у закрывающей скобки namespace (`FixNamespaceComments: true`) | [yatool](https://github.com/yandex/yatool/commit/b5a7ef52b) |
| 2024-10-20 | userver ушёл от чистого Google-стиля (2 пробела, 80 колонок) к 4 пробелам и 120 колонкам | [userver](https://github.com/userver-framework/userver/commit/08d314a21dde87bb22b75caa3b9226016b33497a) |
| 2024-11-22 | обязательные фигурные скобки (`InsertBraces: true`) | [yatool](https://github.com/yandex/yatool/commit/62ce72f44) |
| 2025-01 … 2025-05 | `ya style` переведён на clang-format 18 | [yatool](https://github.com/yandex/yatool/commit/b95528ab0), [yatool](https://github.com/yandex/yatool/commit/36d81ead9) |
| 2025-02-24 | дефолтный конфиг переименован в `.clang-format` | [yatool](https://github.com/yandex/yatool/commit/c55b8d1f1) |
| 2025-07-23 | userver v2.11: C++20 по умолчанию | [changelog userver](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/scripts/docs/en/userver/roadmap_and_changelog.md#L1129) |
| 2025-11-23 | userver: «change code style to ya style», 1855 файлов | [userver](https://github.com/userver-framework/userver/commit/7d7b2f4008e0c5a334ff7350b815360ad61fb9d7) |
| 2026-01-14 … 2026-08-29 | гайд YTsaurus: статические локальные - PascalCase, `\|parameter\|` в комментариях, раздел про `std::optional`, уточнение об акронимах | [ytsaurus](https://github.com/ytsaurus/ytsaurus/commit/15c017e3ec), [ytsaurus](https://github.com/ytsaurus/ytsaurus/commit/b35ffbaeca0d735c637b10a1f4d0e0e91c0346ca), [ytsaurus](https://github.com/ytsaurus/ytsaurus/commit/04e943cd7d0704cd81a5d26012c972b38262ef50) |
| 2026-04-16 | userver v3.0: поддержка C++17 прекращена | [changelog userver](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/scripts/docs/en/userver/roadmap_and_changelog.md#L545-L556) |
| 2026-05-22 | в дефолтный clang-tidy Аркадии включена `bugprone-use-after-move` | [yatool](https://github.com/yandex/yatool/commit/61c8395f3) |
| 2026-07-15 … 2026-09-21 | гайд в CatBoost переписан серией из 18 коммитов: C++14 → C++20, `_` у приватных и защищённых полей, обязательные `{}`, `noexcept` вместо `throw()`, явные значения инициализаторов, комментарий у скобки namespace; снято поощрение `TString`; удалён раздел о `ya style` | [3874f154](https://github.com/catboost/catboost/commit/3874f154ccdb464319de129e17c59a9129e52b19), [f48206f3](https://github.com/catboost/catboost/commit/f48206f3325474c7c2ea56a14de79fdd062ddbc5), [dae4d411](https://github.com/catboost/catboost/commit/dae4d411c59cfb4fea99744094e0a232d79c27da) |
| 2026-07-20, 2026-07-29 | YDB опубликовал `ydb/agents/CODESTYLE.md` и `NO_ABORT.md` | [ydb](https://github.com/ydb-platform/ydb/commit/c8ea4c941264f44f5d5cd63fb2f7de11744cc48a), [ydb](https://github.com/ydb-platform/ydb/commit/61cd3383d) |

Интерпретация: направление общее - больше автоматики в оформлении, C++20 как минимум, сближение со стандартной библиотекой; userver сблизился с «ya style» по оформлению, но не по именам. Редакция гайда в CatBoost и текст YDB появились в июле 2026 года почти одновременно и с одинаковыми новыми правилами - вероятно, оба синхронизированы с обновлённым внутренним гайдом; прямого подтверждения нет.

## 11. Существующий код

### Y-CPP-068 · MUST · «Один файл - один стиль»: небольшая правка следует стилю файла, стилевые правки идут отдельным коммитом, оформление нередактируемых строк не меняют
- Проверка: ручное ревью.
- Источник: [гайд, «Style correction policy»](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/CPP_STYLE_GUIDE.md#L20-L25) (2026-09-21) · производный гайд проекта · высокая; [гайд YT, «General»](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L31) (2026-08-29) · производный гайд проекта · высокая; [YDB CODESTYLE.md](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/agents/CODESTYLE.md#L3-L4) (2026-07-20) · производный гайд проекта · высокая.
- Довод гайда: у каждой строки есть автор в истории, и переформатирование без нужды делает автором вас. Если в старый файл добавляют код в новом стиле, по гайду нужно привести к нему весь файл.

## 12. Машиночитаемые конфиги

| Файл | Инструмент и версия | Что внутри | Локальная проверка (2026-10-09) |
|---|---|---|---|
| [`configs/cpp/.clang-format`](../../configs/cpp/.clang-format) | clang-format ≥ 16; проверено на 18.1.3 | шапка-комментарий и дословная копия дефолтного `.clang-format` Аркадии (md5 тела `c774b57af843ec2725d9659b9820cfe7`, тот же файл в yatool, catboost, ydb, ytsaurus) | `--dump-config` - код 0; тестовые файлы отформатированы, повторный прогон `--dry-run --Werror` - код 0 |
| [`configs/cpp/.clang-tidy`](../../configs/cpp/.clang-tidy) | clang-tidy ≥ 17 (опция `ConceptCase`); проверено на 18.1.3 | реконструкция, не Яндекс: опции дефолтного `config.yaml` Аркадии, проверки из конфигов YQL и YT Flow, опции префиксов | `--verify-config` - «No config errors detected»; файл по профилю - 0 предупреждений, файлы с нарушениями - срабатывания перечислены в шапке конфига |

На других версиях инструментов конфиги не запускались. Оба файла вместе проверены на учебном проекте с CMake: `clang-format --dry-run --Werror` и `run-clang-tidy -warnings-as-errors='*'` завершаются с кодом 0 на коде, написанном по профилю, а нарушение имени в заголовке даёт код 1.

Запуск в обычном репозитории (реконструкция; файлы лежат в корне проекта):

```sh
# форматирование и его проверка
clang-format -i --style=file $(git ls-files '*.h' '*.cpp')
clang-format --dry-run --Werror --style=file $(git ls-files '*.h' '*.cpp')

# clang-tidy: нужна база команд компиляции
cmake -S . -B build -DCMAKE_CXX_STANDARD=20 -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
run-clang-tidy -p build -quiet -warnings-as-errors='*' -header-filter='.*/src/.*'
```

Как это устроено у Яндекса:

- Форматирует `ya style`, проверяет стилевой тест, который включается макросом `STYLE_CPP()` по каталогам. В открытых репозиториях он подключён только для [`util`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/util/linters.make.inc), [`yql/essentials`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/yql/essentials/linters.make.inc), [`ydb/core/nbs`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/nbs/linters.make.inc) и [`ydb/core/tx/columnshard`](https://github.com/ydb-platform/ydb/blob/d9692f89c1dd1605ed8c751416d37740ec8e6bbe/ydb/core/tx/columnshard/linters.make.inc).
- clang-tidy запускается как [`ya test -t -DTIDY`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/en/test.md#L383-L386).
- В публичных GitHub Actions четырёх проектов (ydb, catboost, ytsaurus, userver) отдельной задачи clang-format или clang-tidy нет. Локальный прогон стокового clang-format 18.1.3 с дефолтным конфигом показал несовпадение в 33 из 36 файлов `catboost/libs/model`, 127 из 130 в `ydb/core/base`, 150 из 150 проверенных в `yt/yt/core/misc` (измерение авторов исследования). Интерпретация: основной код YDB, YTsaurus и CatBoost стилевыми инструментами публично не проверяется, стиль там держится на ревью.

Чем конфиги профиля отличаются от того, что работает в Аркадии:

1. **Бинарь.** Яндекс форматирует собственной сборкой [`ynd-clang-format-18`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/mapping.conf.json#L5274). Стоковый clang-format с тем же конфигом расходится с ней в положении `{` после списка инициализации конструктора (Y-CPP-005) и после многострочного условия (Y-CPP-002). Какие ещё патчи есть в сборке - публичных данных не найдено.
2. **Проверки `arcadia-*`.** `arcadia-typeid-name-restriction` и `arcadia-ascii-compare-ignorecase` из дефолтного clang-tidy - собственные проверки Яндекса; их кода в открытых репозиториях нет, из конфига профиля они убраны.
3. **Префиксы.** Проверку `T`/`I`/`E`/`N`, регистра локальных переменных, параметров и публичных методов добавили авторы профиля; в дефолте Аркадии её нет.

Вариант B для `.clang-format` (реконструкция, не Яндекс; проверен на 18.1.3). Если команде важнее буква гайда - `{` на отдельной строке после списка инициализации, - поменяйте три значения и явно задайте `SplitEmptyFunction`. Цена: на новую строку переедет скобка всех функций и методов. Гайд это допускает, util - нет.

```yaml
BreakBeforeBraces: Custom
BraceWrapping:
    AfterFunction: true
    IndentBraces: false
    SplitEmptyFunction: true
```

Сколько правил проверяет инструмент:

| Раздел | Правил | Инструмент | Частично | Ручное ревью |
|---|---|---|---|---|
| Форматирование (001-019) | 19 | 11 | 2 | 6 |
| Именование (020-034) | 15 | 7 | 3 | 5 |
| Файлы и include (035-042) | 8 | 1 | 0 | 7 |
| Комментарии (043-047) | 5 | 0 | 2 | 3 |
| Ошибки, логи, типы (048-055) | 8 | 0 | 0 | 8 |
| Ограничения языка (056-063) | 8 | 3 | 0 | 5 |
| Тесты (064-066) | 3 | 0 | 0 | 3 |
| Стандарт (067) | 1 | 1 | 0 | 0 |
| Существующий код (068) | 1 | 0 | 0 | 1 |
| **Всего** | **68** | **23** | **7** | **38** |

Из 30 правил, которые инструмент проверяет полностью или частично, 13 закрывает дефолтный `.clang-format` Аркадии, 4 - дефолтный clang-tidy Аркадии, 6 - проверки из проектных конфигов YQL и YT Flow, 1 - флаг компилятора и ещё 6 (префиксы типов, перечислений и пространств имён, регистр переменных, концепты) - только реконструкция авторов профиля. Полная матрица по правилам - в [`docs/enforcement.md`](../enforcement.md).

Файл, написанный по профилю (проходит оба инструмента):

```cpp
#pragma once

#include <cstddef>
#include <optional>
#include <stdexcept>
#include <string>

namespace NSample {
    const size_t DEFAULT_CAPACITY = 128;

    enum class EEvictionPolicy {
        LeastRecentlyUsed,
        FirstInFirstOut,
    };

    class TCacheError: public std::runtime_error {
    public:
        explicit TCacheError(const std::string& message);
    };

    //! Read-only view of a cache.
    class ICache {
    public:
        virtual ~ICache() = default;

        virtual std::optional<std::string> Find(const std::string& key) = 0;
        virtual size_t size() const = 0;
    };

    struct TCacheOptions {
        size_t Capacity = DEFAULT_CAPACITY;
        EEvictionPolicy Policy = EEvictionPolicy::LeastRecentlyUsed;
    };

    class TLruCache: public ICache {
    public:
        explicit TLruCache(const TCacheOptions& options);

        std::optional<std::string> Find(const std::string& key) override;
        size_t size() const override;

        void Insert(const std::string& key, std::string value);

    private:
        void EvictOldest();

    private:
        TCacheOptions Options_;
    };
} // namespace NSample
```

## 13. Альтернативы: стиль userver и стиль YTsaurus

### Стиль userver

У userver нет письменного гайда по стилю: в исходниках документации ([оглавление](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/scripts/docs/en/index.md)) такой страницы нет. Стиль задан конфигами и файлом `AGENTS.md`.

| Тема | Что принято в userver | Источник |
|---|---|---|
| Имена типов | PascalCase без префиксов: `Mutex`, `HttpHandlerBase`; `enum class Importance` | [.clang-tidy, L126-L136](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-tidy#L126-L204) |
| Методы и функции | PascalCase; STL-совместимые имена остаются (`lock()`, `begin()`) | там же, L143-L148 |
| Поля | `lower_case`, у `private` и `protected` - завершающий `_` | там же, L137-L142 |
| Переменные и параметры | `lower_case` | там же, L149-L154 |
| Константы и значения enum | `k` + PascalCase: `kEnableAssert`, `kNormal` | там же, L155-L182 |
| Пространства имён | `lower_case` | там же, L185-L189 |
| Форматирование | `BasedOnStyle: Google`, `IndentWidth: 4`, `ColumnLimit: 120`, `AlignAfterOpenBracket: BlockIndent`, `BinPackArguments: false`, `BinPackParameters: false`, `InsertBraces: true`, `BraceWrapping.AfterControlStatement: MultiLine` | [.clang-format](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-format) |
| Статический анализ | включены целые группы (`bugprone-*`, `cert-*`, `cppcoreguidelines-*`, `google-*`, `modernize-*`, `performance-*`, `readability-*` и другие) примерно с 90 исключениями; `WarningsAsErrors: '*'` | [.clang-tidy, L2-L116](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.clang-tidy#L2-L116) |
| Язык и библиотека | C++20 и C++23; стандартная библиотека; `UASSERT` и `UINVARIANT`; `std::unique_ptr` вместо `std::shared_ptr`, когда разделяемое владение не нужно | [AGENTS.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/AGENTS.md#L34-L44), [supported_platforms.md](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/scripts/docs/en/userver/supported_platforms.md#L11-L12) |
| Файлы | `.hpp` и `.cpp`; публичные заголовки в `*/include/userver/…`; тесты `*_test.cpp` | [core/src/engine](https://github.com/userver-framework/userver/tree/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/src/engine) |
| Комментарии | Doxygen `///` с `@file`, `@brief` | [mutex.hpp](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/core/include/userver/engine/mutex.hpp#L3-L27) |

Что нужно знать, прежде чем брать конфиги userver:

- Последняя строка `.clang-format` - `VanillaContinuationIndenter: true` - в апстриме не существует: стоковый clang-format 18.1.3 отвечает `unknown key`. Без неё файл читается; комментарий в самом файле советует удалить строку при работе со стоковым бинарём.
- `.editorconfig` userver [задаёт](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/.editorconfig) для `*.cpp` и `*.hpp` отступ 2 пробела, а `.clang-format` с 2024-10-20 - 4. Файл `service_template/.clang-format` [остался](https://github.com/userver-framework/userver/blob/fa7f95824253d98f35b69a52f566e9a0ed29fdbf/service_template/.clang-format) чистым Google-стилем (2 пробела, 80 колонок).
- Стоковый clang-tidy 18.1.3 на конфиге userver сообщает о трёх неизвестных проверках из более новых версий.

Когда брать: если совместимость со стоковыми инструментами и стандартной библиотекой важнее узнаваемых аркадийных имён. По именам и основе форматирования этот стиль ближе к профилю Google, чем к остальному C++-коду Яндекса.

### Стиль YTsaurus

[Гайд YTsaurus](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md) - самый подробный публичный текст о практиках: логи, ошибки, `auto`, целые, владение. Имена совпадают с аркадийными, отличия - в оформлении:

- `{` у классов и функций - [на следующей строке](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L648-L678), у пространств имён, лямбд и управляющих конструкций - на той же.
- Тело namespace без отступа; вложенные пространства имён записываются как `namespace NYT::NChunkPools {`; содержимое namespace отделяется от окружения [строкой из 80 символов `/`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L145-L147).
- Базовые классы и инициализаторы конструктора - каждый на своей строке с ведущим двоеточием или запятой; пустое тело функции пишется как `{ }`.
- Константы, глобальные и статические переменные - PascalCase; перечисления объявляются макросом `DEFINE_ENUM`; свойства - макросами `DEFINE_BYVAL_RW_PROPERTY` и подобными.
- Знаковые целые по умолчанию; предварительные объявления в `public.h`; основной указатель - `TIntrusivePtr`, объекты создаются через `New<T>()`.

Конфигов clang-format и clang-tidy для основного кода команда [не публикует](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L29); подпроект Flow форматируется командой `ya style --cpp-yt` с патченным бинарём, и его [`.clang-format`](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/yt/flow/.clang-format) стоковый clang-format 18.1.3 не читает (`unknown key 'AfterLambdaCaptureList'`). Гайд действует в `yt/yt`, `yt/chyt`, `yt/yql`, `library/cpp/yt` и [не распространяется](https://github.com/ytsaurus/ytsaurus/blob/6456ed3d4de2144a605e71d223beb7a9942bb8b9/yt/styleguide/cpp.md#L8-L21) на C++ SDK `yt/cpp`, `util` и остальной `library/cpp`. Когда брать: при работе над самим YTsaurus.

### Гайд ClickHouse - не Яндекс

[Гайд ClickHouse по C++](https://clickhouse.com/docs/resources/develop-contribute/contribute/style.md) - документ отдельной компании: ClickHouse отделилась от Яндекса. С аркадийным стилем его роднят 4 пробела, `#pragma once`, исключения, собственные имена целых типов, каталог `contrib`, префикс `I` у интерфейсов; имена, скобки и длина строки (140) там другие. Источником правил профиля он не служит.

## 14. Чего в публичных источниках нет

- Текст общего гайда Аркадии недоступен; насколько редакция в CatBoost совпадает с ним сегодня - публичных данных не найдено.
- Письменных правил о RTTI, о политике `noexcept`, о выборе между `THolder` и `std::unique_ptr`, об именах шаблонных параметров и каталогов, о лицензионных заголовках, об именах тестов и о покрытии - публичных данных не найдено.
- Общего для Аркадии правила о логировании и об `auto` нет; есть только правила YTsaurus.
- Состав патчей `ynd-clang-format-18` и код проверок `arcadia-*` не опубликованы.
- Публичных докладов или статей инженеров Яндекса о происхождении префиксов `T`/`I`/`E`/`N` и о работе `cppcommittee` не найдено.
- Запускаются ли стилевые тесты в PR-проверках YDB и как устроен внутренний CI userver - публичных данных не найдено.
