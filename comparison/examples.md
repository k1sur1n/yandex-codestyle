# Один код - два стиля

> Данные актуальны на 2026-10-09.

Шесть пар примеров показывают одно и то же - класс на C++, модуль на Python, UI-компонент, сообщение коммита с описанием PR, конфиг и скрипт обучения модели, README репозитория - написанное по правилам профиля Яндекса и по правилам профиля Google. Разница заметна уже в первой строке файла: у Google это лицензионный заголовок, у Яндекса - `#pragma once` или сразу импорты. Дальше расходятся имена (`TTokenBucket` против `TokenBucket`, `Options_` против `options_`), длина строки (без предела против 80 колонок), обработка ошибок (исключения против `absl::StatusOr`), формат docstring (reST против секций `Args:`/`Returns:`) и форма коммита (Conventional Commits против свободного заголовка с заглавной буквы). Весь код проверен инструментами профилей: clang-format 18.1.3, clang-tidy 18.1.3, g++ 13.3 и clang++ 18.1.3, ruff 0.16.8, mypy и pyright, Prettier 3.8.1. Что именно запускалось и что проверить было нельзя - в [последнем разделе](#что-проверено-инструментами).

Как профили устроены в целом, разобрано в соседних файлах: [approach.md](approach.md) (философия и контроль соблюдения), [code.md](code.md) (таблицы «параметр → Яндекс → Google → почему» по языкам), [repository.md](repository.md) (git и open source), [ml.md](ml.md) (MLE и MLOps). Здесь - только примеры.

## Как читать примеры

Каждая пара устроена одинаково:

1. **Задача** - что именно пишем, в двух-трёх предложениях.
2. **Версия Яндекса** - код по профилю [корень репозитория yandex-codestyle](../README.md).
3. **Версия Google** - тот же код по профилю [google-codestyle](https://github.com/k1sur1n/google-codestyle/blob/main/README.md).
4. **Таблица различий** - «что отличается | Яндекс | Google | правила». В последнем столбце - ID правил обоих профилей; каждый ID ведёт в документ, где правило описано с источником и способом проверки. Если в одном из профилей правила на этот счёт нет, в ячейке так и написано: «правила нет». Каждое стилевое решение в коде прослеживается до правила; решений «от себя» в коде нет, а там, где профиль молчит, выбран самый нейтральный вариант, и это отмечено.
5. **Почему так** - один-три абзаца. Факты со ссылкой на правило; выводы помечены словом «Интерпретация».

Код написан по-английски, как в реальных проектах; комментарии в коде тоже английские, потому что оба профиля этого требуют ([Y-CPP-043](../docs/languages/cpp.md), [Y-PY-022](../docs/languages/python.md); у Google язык комментариев отдельно не оговорён, но все примеры гайдов английские). Имена проекта (`ratelimit`, `Ratelimit Authors`) условные.

Версии инструментов: clang-format 18.1.3, clang-tidy 18.1.3, g++ 13.3.0, clang++ 18.1.3, Python 3.13.16, ruff 0.16.8, Prettier 3.8.1 - те же, на которых проверены конфиги профилей. Библиотек ML (CatBoost, Keras, JAX, ml_collections) в среде сборки нет - установлен только absl-py, - поэтому скрипты пятой пары проверены только статически.

## 1. Класс на C++

**Задача.** Библиотека ограничения частоты запросов: интерфейс часов (чтобы тесты подставляли фальшивое время), класс «ведро токенов», который владеет часами, перечисление с политикой переполнения, константа по умолчанию, ошибка на некорректных параметрах, и тест. Три файла: заголовок, реализация, тест.

### Версия Яндекса

`ratelimit/token_bucket.h`:

```cpp
#pragma once

#include <chrono>
#include <cstdint>
#include <memory>
#include <stdexcept>
#include <string>

namespace NRateLimit {
    const uint64_t DEFAULT_CAPACITY = 100;

    //! What TryAcquire() does with a request larger than the bucket capacity.
    enum class EOverflowPolicy {
        Reject,
        Clamp,
    };

    //! Base class for all errors of the library.
    class TRateLimitError: public std::runtime_error {
    public:
        explicit TRateLimitError(const std::string& message);
    };

    //! Source of monotonic time; production code uses the system clock, tests inject a fake.
    class IClock {
    public:
        virtual ~IClock() = default;

        virtual std::chrono::steady_clock::time_point Now() const = 0;
    };

    struct TTokenBucketOptions {
        uint64_t Capacity = DEFAULT_CAPACITY;
        uint64_t RefillPerSecond = DEFAULT_CAPACITY;
        EOverflowPolicy Policy = EOverflowPolicy::Reject;
    };

    //! Token bucket rate limiter. Owns its clock.
    class TTokenBucket {
    public:
        //! Throws TRateLimitError if Capacity or RefillPerSecond is zero. The clock must not be null.
        TTokenBucket(const TTokenBucketOptions& options, std::unique_ptr<IClock> clock);

        //! Takes `count` tokens; returns false if there are not enough of them.
        bool TryAcquire(uint64_t count);
        uint64_t GetAvailable() const;

    private:
        void Refill();

    private:
        TTokenBucketOptions Options_;
        std::unique_ptr<IClock> Clock_;
        uint64_t Tokens_;
        std::chrono::steady_clock::time_point LastRefill_;
    };
} // namespace NRateLimit
```

`ratelimit/token_bucket.cpp`:

```cpp
#include "token_bucket.h"

#include <algorithm>
#include <utility>

namespace NRateLimit {
    TRateLimitError::TRateLimitError(const std::string& message)
        : std::runtime_error(message) {
    }

    TTokenBucket::TTokenBucket(const TTokenBucketOptions& options, std::unique_ptr<IClock> clock)
        : Options_(options)
        , Clock_(std::move(clock))
        , Tokens_(options.Capacity)
        , LastRefill_(Clock_->Now()) {
        if (Options_.Capacity == 0) {
            throw TRateLimitError("Capacity must be positive");
        }
        if (Options_.RefillPerSecond == 0) {
            throw TRateLimitError("RefillPerSecond must be positive");
        }
    }

    bool TTokenBucket::TryAcquire(uint64_t count) {
        Refill();
        if (count > Options_.Capacity) {
            switch (Options_.Policy) {
                case EOverflowPolicy::Reject:
                    return false;
                case EOverflowPolicy::Clamp:
                    count = Options_.Capacity;
                    break;
            }
        }
        if (count > Tokens_) {
            return false;
        }
        Tokens_ -= count;
        return true;
    }

    uint64_t TTokenBucket::GetAvailable() const {
        return Tokens_;
    }

    void TTokenBucket::Refill() {
        auto now = Clock_->Now();
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(now - LastRefill_);
        if (elapsed.count() <= 0) {
            return;
        }
        uint64_t refilled = static_cast<uint64_t>(elapsed.count()) * Options_.RefillPerSecond;
        Tokens_ = std::min(Options_.Capacity, Tokens_ + refilled);
        LastRefill_ = now;
    }
} // namespace NRateLimit
```

`ratelimit/ut/token_bucket_ut.cpp`:

```cpp
#include <ratelimit/token_bucket.h>

#include <gtest/gtest.h>

#include <chrono>
#include <memory>

namespace {
    class TFakeClock: public NRateLimit::IClock {
    public:
        std::chrono::steady_clock::time_point Now() const override {
            return Now_;
        }

        void Advance(std::chrono::seconds delta) {
            Now_ += delta;
        }

    private:
        std::chrono::steady_clock::time_point Now_;
    };
} // namespace

TEST(TTokenBucketTest, RejectsWhenEmpty) {
    NRateLimit::TTokenBucketOptions options;
    options.Capacity = 2;
    options.RefillPerSecond = 1;
    NRateLimit::TTokenBucket bucket(options, std::make_unique<TFakeClock>());

    EXPECT_TRUE(bucket.TryAcquire(2));
    EXPECT_FALSE(bucket.TryAcquire(1));
}

TEST(TTokenBucketTest, RefillsAfterOneSecond) {
    auto clock = std::make_unique<TFakeClock>();
    TFakeClock* clockView = clock.get();
    NRateLimit::TTokenBucketOptions options;
    options.Capacity = 2;
    options.RefillPerSecond = 1;
    NRateLimit::TTokenBucket bucket(options, std::move(clock));

    EXPECT_TRUE(bucket.TryAcquire(2));
    clockView->Advance(std::chrono::seconds(1));
    EXPECT_EQ(bucket.GetAvailable(), 0u);
    EXPECT_TRUE(bucket.TryAcquire(1));
}

TEST(TTokenBucketTest, ThrowsOnZeroCapacity) {
    NRateLimit::TTokenBucketOptions options;
    options.Capacity = 0;

    EXPECT_THROW(
        NRateLimit::TTokenBucket(options, std::make_unique<TFakeClock>()),
        NRateLimit::TRateLimitError);
}
```

### Версия Google

`ratelimit/token_bucket.h`:

```cpp
// Copyright 2026 The Ratelimit Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef RATELIMIT_TOKEN_BUCKET_H_
#define RATELIMIT_TOKEN_BUCKET_H_

#include <chrono>
#include <memory>

#include "absl/status/statusor.h"

namespace ratelimit {

constexpr int kDefaultCapacity = 100;

// What TryAcquire() does with a request larger than the bucket capacity.
enum class OverflowPolicy {
  kReject,
  kClamp,
};

// Source of monotonic time. Production code uses the system clock; tests
// inject a fake.
class Clock {
 public:
  virtual ~Clock() = default;

  virtual std::chrono::steady_clock::time_point Now() const = 0;
};

struct TokenBucketOptions {
  int capacity = kDefaultCapacity;
  int refill_per_second = kDefaultCapacity;
  OverflowPolicy policy = OverflowPolicy::kReject;
};

// Token bucket rate limiter. Owns its clock.
//
// Instances are created with Create(), which validates the options; the
// constructor itself cannot fail.
class TokenBucket {
 public:
  // Returns InvalidArgumentError if `options.capacity` or
  // `options.refill_per_second` is not positive or `clock` is null.
  static absl::StatusOr<std::unique_ptr<TokenBucket>> Create(
      const TokenBucketOptions& options, std::unique_ptr<Clock> clock);

  TokenBucket(const TokenBucket&) = delete;
  TokenBucket& operator=(const TokenBucket&) = delete;

  // Takes `count` tokens. Returns false if there are not enough of them.
  bool TryAcquire(int count);

  int available() const { return tokens_; }

 private:
  TokenBucket(const TokenBucketOptions& options, std::unique_ptr<Clock> clock);

  void Refill();

  TokenBucketOptions options_;
  std::unique_ptr<Clock> clock_;
  int tokens_;
  std::chrono::steady_clock::time_point last_refill_;
};

}  // namespace ratelimit

#endif  // RATELIMIT_TOKEN_BUCKET_H_
```

`ratelimit/token_bucket.cc` (лицензионный заголовок тот же, здесь опущен):

```cpp
#include "ratelimit/token_bucket.h"

#include <algorithm>
#include <chrono>
#include <cstdint>
#include <memory>
#include <utility>

#include "absl/status/status.h"
#include "absl/status/statusor.h"
#include "absl/strings/str_cat.h"

namespace ratelimit {

absl::StatusOr<std::unique_ptr<TokenBucket>> TokenBucket::Create(
    const TokenBucketOptions& options, std::unique_ptr<Clock> clock) {
  if (options.capacity <= 0) {
    return absl::InvalidArgumentError(
        absl::StrCat("capacity must be positive, got ", options.capacity));
  }
  if (options.refill_per_second <= 0) {
    return absl::InvalidArgumentError(absl::StrCat(
        "refill_per_second must be positive, got ", options.refill_per_second));
  }
  if (clock == nullptr) {
    return absl::InvalidArgumentError("clock must not be null");
  }
  // std::make_unique cannot reach the private constructor.
  return std::unique_ptr<TokenBucket>(
      new TokenBucket(options, std::move(clock)));
}

TokenBucket::TokenBucket(const TokenBucketOptions& options,
                         std::unique_ptr<Clock> clock)
    : options_(options),
      clock_(std::move(clock)),
      tokens_(options.capacity),
      last_refill_(clock_->Now()) {}

bool TokenBucket::TryAcquire(int count) {
  Refill();
  if (count > options_.capacity) {
    switch (options_.policy) {
      case OverflowPolicy::kReject:
        return false;
      case OverflowPolicy::kClamp:
        count = options_.capacity;
        break;
    }
  }
  if (count > tokens_) {
    return false;
  }
  tokens_ -= count;
  return true;
}

void TokenBucket::Refill() {
  const std::chrono::steady_clock::time_point now = clock_->Now();
  const int64_t elapsed_seconds =
      std::chrono::duration_cast<std::chrono::seconds>(now - last_refill_)
          .count();
  if (elapsed_seconds <= 0) {
    return;
  }
  const int64_t refilled = elapsed_seconds * options_.refill_per_second;
  tokens_ = static_cast<int>(
      std::min<int64_t>(options_.capacity, tokens_ + refilled));
  last_refill_ = now;
}

}  // namespace ratelimit
```

`ratelimit/token_bucket_test.cc` (лицензионный заголовок опущен):

```cpp
#include "ratelimit/token_bucket.h"

#include <chrono>
#include <memory>
#include <utility>

#include "absl/status/status.h"
#include "absl/status/statusor.h"
#include "gtest/gtest.h"

namespace ratelimit {
namespace {

class FakeClock : public Clock {
 public:
  std::chrono::steady_clock::time_point Now() const override { return now_; }

  void Advance(std::chrono::seconds delta) { now_ += delta; }

 private:
  std::chrono::steady_clock::time_point now_;
};

TEST(TokenBucketTest, RejectsWhenEmpty) {
  TokenBucketOptions options;
  options.capacity = 2;
  options.refill_per_second = 1;
  absl::StatusOr<std::unique_ptr<TokenBucket>> bucket =
      TokenBucket::Create(options, std::make_unique<FakeClock>());
  ASSERT_TRUE(bucket.ok());

  EXPECT_TRUE((*bucket)->TryAcquire(2));
  EXPECT_FALSE((*bucket)->TryAcquire(1));
}

TEST(TokenBucketTest, RefillsAfterOneSecond) {
  auto clock = std::make_unique<FakeClock>();
  FakeClock* clock_view = clock.get();
  TokenBucketOptions options;
  options.capacity = 2;
  options.refill_per_second = 1;
  absl::StatusOr<std::unique_ptr<TokenBucket>> bucket =
      TokenBucket::Create(options, std::move(clock));
  ASSERT_TRUE(bucket.ok());

  EXPECT_TRUE((*bucket)->TryAcquire(2));
  clock_view->Advance(std::chrono::seconds(1));
  EXPECT_EQ((*bucket)->available(), 0);
  EXPECT_TRUE((*bucket)->TryAcquire(1));
}

TEST(TokenBucketTest, CreateFailsOnZeroCapacity) {
  TokenBucketOptions options;
  options.capacity = 0;

  absl::StatusOr<std::unique_ptr<TokenBucket>> bucket =
      TokenBucket::Create(options, std::make_unique<FakeClock>());
  EXPECT_EQ(bucket.status().code(), absl::StatusCode::kInvalidArgument);
}

}  // namespace
}  // namespace ratelimit
```

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Первая строка файла | `#pragma once` в заголовке; в `.cpp` - сразу `#include` своего заголовка; лицензионной шапки нет, лицензия лежит одним файлом `LICENSE` | лицензионный заголовок Apache-2.0 в каждом файле: год создания и правообладатель «The Ratelimit Authors», без имён авторов | [Y-CPP-035](../docs/languages/cpp.md), [Y-CPP-036](../docs/languages/cpp.md) · [G-CPP-029](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-REPO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Защита заголовка | `#pragma once` | `#ifndef RATELIMIT_TOKEN_BUCKET_H_` … `#endif  // RATELIMIT_TOKEN_BUCKET_H_`, имя от пути файла в проекте; `#pragma once` запрещён | [Y-CPP-035](../docs/languages/cpp.md) · [G-CPP-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Имена файлов и место теста | `.h` + `.cpp`; тест `ut/token_bucket_ut.cpp` в подкаталоге | `.h` + `.cc`; тест `token_bucket_test.cc` рядом с кодом | [Y-CPP-034](../docs/languages/cpp.md), [Y-CPP-065](../docs/languages/cpp.md) · [G-CPP-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-071](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Отступ и длина строки | 4 пробела; `ColumnLimit: 0` - форматтер строки не переносит, ориентир 110 (самая длинная строка примера - 102 символа) | 2 пробела; 80 колонок, переносы расставляет clang-format | [Y-CPP-001](../docs/languages/cpp.md), [Y-CPP-018](../docs/languages/cpp.md) · [G-CPP-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Пространство имён | `NRateLimit`; тело с отступом; `} // namespace NRateLimit` | `ratelimit`; тело без отступа, пустая строка после `{`; `}  // namespace ratelimit` с двумя пробелами перед комментарием | [Y-CPP-010](../docs/languages/cpp.md), [Y-CPP-023](../docs/languages/cpp.md) · [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Имена типов | `TTokenBucket`, `TTokenBucketOptions`, `IClock`, `EOverflowPolicy`, `TRateLimitError` - префиксы `T`/`I`/`E` | `TokenBucket`, `TokenBucketOptions`, `Clock`, `OverflowPolicy` - PascalCase без префиксов; отдельного обозначения для интерфейса в профиле нет (правила нет) | [Y-CPP-020](../docs/languages/cpp.md), [Y-CPP-021](../docs/languages/cpp.md), [Y-CPP-022](../docs/languages/cpp.md) · [G-CPP-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Значения перечисления | `Reject`, `Clamp` | `kReject`, `kClamp` | [Y-CPP-022](../docs/languages/cpp.md) · [G-CPP-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Константа | `const uint64_t DEFAULT_CAPACITY` (форма из образца профиля; о `constexpr` правила нет) | `constexpr int kDefaultCapacity` | [Y-CPP-028](../docs/languages/cpp.md) · [G-CPP-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-044](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Поля | `Options_`, `Tokens_`, `LastRefill_` - PascalCase с `_`; в структуре `Capacity`, `Policy` без `_` | `options_`, `tokens_` - snake_case с `_`; в структуре `capacity`, `policy` | [Y-CPP-026](../docs/languages/cpp.md) · [G-CPP-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Локальные переменные и параметры | `clockView`, `elapsed`, `count` - camelCase | `clock_view`, `elapsed_seconds` - snake_case | [Y-CPP-027](../docs/languages/cpp.md) · [G-CPP-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Методы | всё в PascalCase; простой геттер - `GetAvailable()`, определён в `.cpp` | `TryAcquire()` в PascalCase, но аксессор `available()` в snake_case и определён в заголовке (короткая функция) | [Y-CPP-024](../docs/languages/cpp.md), [Y-CPP-025](../docs/languages/cpp.md) · [G-CPP-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Раскладка класса | метки доступа в колонке класса; методы и поля - в разных секциях `private:`; первый `private:` указан явно | метки с отступом в 1 пробел; порядок `public` → `private`, внутри секции сначала функции, потом поля | [Y-CPP-011](../docs/languages/cpp.md), [Y-CPP-012](../docs/languages/cpp.md) · [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-026](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Список инициализации | каждый элемент на своей строке, `:` и `,` в начале строк; `{` стоковый clang-format прижимает к последнему инициализатору (профиль это принимает) | `: options_(options),` - запятые в конце строк; пустое тело `{}` на той же строке | [Y-CPP-005](../docs/languages/cpp.md) · [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Наследование | `class TRateLimitError: public std::runtime_error` - без пробела перед `:` | `class FakeClock : public Clock` - пробелы с обеих сторон | [Y-CPP-009](../docs/languages/cpp.md) · [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Ошибка на плохих параметрах | конструктор бросает `TRateLimitError` - наследника `std::runtime_error`, базовый класс ошибок библиотеки | конструктор закрыт и не может завершиться ошибкой; фабрика `Create()` возвращает `absl::StatusOr<std::unique_ptr<TokenBucket>>` с `absl::InvalidArgumentError`; сборка с `-fno-exceptions` | [Y-CPP-048](../docs/languages/cpp.md), [Y-CPP-049](../docs/languages/cpp.md) · [G-CPP-034](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-036](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Копируемость класса | не объявлена (правила нет) | копирование удалено явно в секции `public` | правила нет · [G-CPP-047](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Целые типы | `uint64_t` для счётчиков - в профиле единой позиции нет: дополнения CatBoost требуют беззнаковые 64-битные, гайд YTsaurus - `int` | `int`; `int64_t` там, где важна разрядность; беззнаковые - только для битовых масок | правила нет (см. [«Целые типы»](../docs/languages/cpp.md)) · [G-CPP-040](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Порядок `#include` | от частного к общему: свой заголовок, проект, сторонние библиотеки, стандартная библиотека; форматтер порядок не трогает (`SortIncludes: false`) | свой заголовок → стандартная библиотека → остальные (`absl`, `gtest`) по алфавиту; группы расставляет clang-format | [Y-CPP-039](../docs/languages/cpp.md) · [G-CPP-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Скобки в `#include` | кавычки только для своего каталога; остальное, включая `<ratelimit/token_bucket.h>` из теста и `<gtest/gtest.h>`, - в угловых скобках | кавычки для всего, кроме стандартной и системной библиотеки: `"absl/status/status.h"`, `"gtest/gtest.h"`; путь от корня проекта | [Y-CPP-039](../docs/languages/cpp.md) · [G-CPP-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Комментарии к объявлениям | Doxygen-стиль `//!` | обычный `//`; у функции - глагол в третьем лице («Returns…», «Takes…») | [Y-CPP-045](../docs/languages/cpp.md) · [G-CPP-030](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| `auto` | `auto now`, `auto elapsed` - для локальных переменных | явный тип там, где его не видно из контекста: `const std::chrono::steady_clock::time_point now`, `const int64_t elapsed_seconds` | [Y-CPP-054](../docs/languages/cpp.md) · [G-CPP-045](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Владение часами | `std::unique_ptr<IClock>`; сырой `TFakeClock*` в тесте - невладеющая ссылка | то же: `std::unique_ptr<Clock>` и невладеющий `FakeClock*` | [Y-CPP-053](../docs/languages/cpp.md) · [G-CPP-049](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| `switch` по перечислению | метки `case` с отступом (конфиг `IndentCaseLabels: true`); о `default` правила нет | то же оформление; `default` не нужен, полноту перебора проверяет `-Wswitch` | конфиг (правила нет) · [G-CPP-066](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |
| Тест | GoogleTest; набор `TTokenBucketTest` (имя с `T` - наблюдение по коду, не правило); `EXPECT_THROW`; фейк в анонимном namespace верхнего уровня | GoogleTest; `TokenBucketTest` без подчёркиваний; проверяется `status().code()`; фейк и тесты в анонимном namespace внутри `ratelimit` | [Y-CPP-066](../docs/languages/cpp.md), [Y-CPP-041](../docs/languages/cpp.md) · [G-CPP-070](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-071](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-025](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) |

### Почему так

Самое крупное различие - не оформление, а обработка ошибок. Гайд Google запрещает исключения и объясняет это не принципом, а практикой: существующий код компании на исключения не рассчитан, а открытым проектам Google они не рекомендуются, чтобы код можно было использовать внутри ([G-CPP-034](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), раздел 5.1 профиля). Отсюда цепочка следствий в версии Google: конструктор не может сообщить об ошибке, поэтому он закрыт, а объект создаёт фабрика ([G-CPP-036](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); фабрика возвращает `absl::StatusOr` ([G-CPP-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); тест проверяет код статуса, а не тип исключения. Аркадийный гайд, наоборот, требует сообщать об ошибках исключениями и допускает коды возврата только в C-коде и в местах с доказанной критичностью для производительности ([Y-CPP-048](../docs/languages/cpp.md)), поэтому версия Яндекса короче: конструктор проверяет параметры и бросает.

Второе различие - что делает форматтер. В профиле Google clang-format решает всё: длину строки, переносы, группировку и сортировку `#include`, пробелы перед комментарием. В профиле Яндекса дефолтный конфиг Аркадии ставит `ColumnLimit: 0` и `SortIncludes: false` ([Y-CPP-018](../docs/languages/cpp.md), [Y-CPP-039](../docs/languages/cpp.md)): длина строки и порядок включений остаются на авторе и ревьюере. Интерпретация: это согласуется с тем, что аркадийный порядок `#include` - «от частного к общему» - задуман как проверка независимости заголовков, а не как механическая сортировка, и выразить его одним регулярным выражением сложнее, чем алфавит.

Третье - имена. Префиксы `T`/`I`/`E`/`N` подтверждены кодом util, CatBoost, YDB и YTsaurus, но дефолтный clang-tidy Аркадии их не проверяет: в Яндексе они держатся на ревью, а в профиле - на реконструированном конфиге (раздел 2 [профиля C++](../docs/languages/cpp.md)). У Google имена тоже проверяет не семейство `google-*`, а настроенный `readability-identifier-naming` (раздел 9.4 [профиля](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Интерпретация: в обеих компаниях именование - предмет договорённости и ревью, а публичный инструмент лишь приближает её; обе версии примера проходят соответствующий конфиг с нулём замечаний, но ни один из конфигов не поймал бы, например, интерфейс с полем или геттер без `Get`.

## 2. Модуль на Python

**Задача.** Модуль повторных попыток: политика экспоненциальной задержки (dataclass), собственное исключение, типизированная функция `run_with_retry`, которая вызывает операцию, пишет в лог неудачные попытки и сдаётся по политике; константы, TODO и тест на pytest.

### Версия Яндекса

`src/ratelimit/retry.py`:

```python
import logging
import random
import time
from collections.abc import Callable
from dataclasses import dataclass
from typing import TypeVar

logger = logging.getLogger(__name__)

DEFAULT_MAX_ATTEMPTS = 3
MAX_DELAY_SECONDS = 30.0

T = TypeVar("T")


class RetryError(Exception):
    """Base class for all errors raised by this module."""


class RetriesExhaustedError(RetryError):
    """Every attempt failed; the last error is attached as ``__cause__``."""

    def __init__(self, attempts: int) -> None:
        super().__init__(f"Operation failed after {attempts} attempts")
        self.attempts = attempts


@dataclass(frozen=True)
class RetryPolicy:
    """Exponential backoff with optional jitter.

    :param max_attempts: how many times the operation is tried in total.
    :param base_delay: delay before the second attempt, in seconds.
    :param multiplier: growth factor of the delay between attempts.
    :param jitter: if true, the delay is multiplied by a random factor in [0.5, 1.5).
    """

    max_attempts: int = DEFAULT_MAX_ATTEMPTS
    base_delay: float = 0.1
    multiplier: float = 2.0
    jitter: bool = False

    def delay_for(self, attempt: int) -> float:
        """Return the delay before the given attempt (1-based); zero before the first one."""
        if attempt <= 1:
            return 0.0
        delay = min(self.base_delay * self.multiplier ** (attempt - 2), MAX_DELAY_SECONDS)
        if self.jitter:
            delay *= random.uniform(0.5, 1.5)
        return delay


def run_with_retry(
    operation: Callable[[], T],
    policy: RetryPolicy,
    retry_on: tuple[type[Exception], ...],
    sleep: Callable[[float], None] = time.sleep,
) -> T:
    """Call ``operation`` until it succeeds or the policy gives up.

    :param operation: zero-argument callable to run.
    :param policy: how many attempts to make and how long to wait between them.
    :param retry_on: exception classes that trigger another attempt; anything else propagates.
    :param sleep: function used to wait; tests pass a fake.
    :return: whatever ``operation`` returned.
    :raises RetriesExhaustedError: if every attempt failed.
    """
    # TODO(ivanov): support asynchronous operations.
    last_error: Exception | None = None
    for attempt in range(1, policy.max_attempts + 1):
        delay = policy.delay_for(attempt)
        if delay > 0:
            sleep(delay)
        try:
            return operation()
        except retry_on as error:
            last_error = error
            logger.warning("Attempt %d of %d failed: %s", attempt, policy.max_attempts, error)
    raise RetriesExhaustedError(policy.max_attempts) from last_error
```

`tests/test_retry.py`:

```python
import pytest

from ratelimit.retry import RetriesExhaustedError, RetryPolicy, run_with_retry


def test_delay_grows_geometrically() -> None:
    policy = RetryPolicy(base_delay=0.1, multiplier=2.0)

    assert policy.delay_for(1) == 0.0
    assert policy.delay_for(2) == pytest.approx(0.1)
    assert policy.delay_for(3) == pytest.approx(0.2)


def test_gives_up_after_max_attempts() -> None:
    calls: list[int] = []
    slept: list[float] = []

    def failing() -> None:
        calls.append(1)
        raise ConnectionError("boom")

    policy = RetryPolicy(max_attempts=3, base_delay=0.1)
    with pytest.raises(RetriesExhaustedError) as excinfo:
        run_with_retry(failing, policy, retry_on=(ConnectionError,), sleep=slept.append)

    assert len(calls) == 3
    assert slept == pytest.approx([0.1, 0.2])
    assert excinfo.value.attempts == 3
    assert isinstance(excinfo.value.__cause__, ConnectionError)
```

### Версия Google

`src/ratelimit/retry.py` (пакет `ratelimit/__init__.py` с тем же лицензионным заголовком и однострочным докстрингом здесь не показан):

```python
# Copyright 2026 The Ratelimit Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Retrying of operations with exponential backoff.

Typical usage:

    policy = retry.RetryPolicy(max_attempts=5, base_delay=0.2)
    rows = retry.run_with_retry(fetch, policy, retry_on=(ConnectionError,))
"""

from collections.abc import Callable
import dataclasses
import logging
import random
import time
from typing import TypeVar

DEFAULT_MAX_ATTEMPTS = 3
_MAX_DELAY_SECONDS = 30.0

_T = TypeVar('_T')


class RetriesExhaustedError(Exception):
    """Every attempt of a retried operation has failed.

    Attributes:
        attempts: How many attempts were made.
    """

    def __init__(self, attempts: int) -> None:
        """Initializes the error.

        Args:
            attempts: How many attempts were made.
        """
        super().__init__(f'Operation failed after {attempts} attempts')
        self.attempts = attempts


@dataclasses.dataclass(frozen=True)
class RetryPolicy:
    """A schedule of delays between repeated attempts.

    Attributes:
        max_attempts: How many times the operation is tried in total.
        base_delay: Delay before the second attempt, in seconds.
        multiplier: Growth factor of the delay between attempts.
        jitter: Whether the delay is multiplied by a random factor in
            [0.5, 1.5).
    """

    max_attempts: int = DEFAULT_MAX_ATTEMPTS
    base_delay: float = 0.1
    multiplier: float = 2.0
    jitter: bool = False

    def delay_for(self, attempt: int) -> float:
        """Returns the delay before the given attempt.

        Args:
            attempt: 1-based number of the attempt.

        Returns:
            The delay in seconds; zero before the first attempt.
        """
        if attempt <= 1:
            return 0.0
        delay = min(
            self.base_delay * self.multiplier ** (attempt - 2),
            _MAX_DELAY_SECONDS,
        )
        if self.jitter:
            delay *= random.uniform(0.5, 1.5)
        return delay


def run_with_retry(
    operation: Callable[[], _T],
    policy: RetryPolicy,
    retry_on: tuple[type[Exception], ...],
    sleep: Callable[[float], None] = time.sleep,
) -> _T:
    """Calls `operation` until it succeeds or the policy gives up.

    Args:
        operation: Zero-argument callable to run.
        policy: How many attempts to make and how long to wait between them.
        retry_on: Exception classes that trigger another attempt; anything
            else propagates.
        sleep: Function used to wait; tests pass a fake.

    Returns:
        Whatever `operation` returned.

    Raises:
        RetriesExhaustedError: Every attempt failed. The last error is
            attached as `__cause__`.
    """
    # TODO: https://example.com/ratelimit/issues/7 - Support async operations.
    last_error: Exception | None = None
    for attempt in range(1, policy.max_attempts + 1):
        delay = policy.delay_for(attempt)
        if delay > 0:
            sleep(delay)
        try:
            return operation()
        except retry_on as error:
            last_error = error
            logging.warning(
                'Attempt %d of %d failed: %r',
                attempt,
                policy.max_attempts,
                error,
            )
    raise RetriesExhaustedError(policy.max_attempts) from last_error
```

`src/ratelimit/retry_test.py` (лицензионный заголовок опущен):

```python
import pytest

from ratelimit import retry


def test_delay_for_first_attempt_is_zero() -> None:
    policy = retry.RetryPolicy(base_delay=0.1, multiplier=2.0)

    assert policy.delay_for(1) == 0.0


def test_delay_for_later_attempts_grows_geometrically() -> None:
    policy = retry.RetryPolicy(base_delay=0.1, multiplier=2.0)

    assert policy.delay_for(2) == pytest.approx(0.1)
    assert policy.delay_for(3) == pytest.approx(0.2)


def test_run_with_retry_gives_up_after_max_attempts() -> None:
    calls: list[int] = []
    slept: list[float] = []

    def failing() -> None:
        calls.append(1)
        raise ConnectionError('boom')

    policy = retry.RetryPolicy(max_attempts=3, base_delay=0.1)
    with pytest.raises(retry.RetriesExhaustedError) as excinfo:
        retry.run_with_retry(
            failing, policy, retry_on=(ConnectionError,), sleep=slept.append
        )

    assert len(calls) == 3
    assert slept == pytest.approx([0.1, 0.2])
    assert excinfo.value.attempts == 3
    assert isinstance(excinfo.value.__cause__, ConnectionError)
```

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Начало файла | сразу импорты; лицензионной шапки нет; о докстринге модуля правила нет | лицензионный заголовок Apache-2.0, затем докстринг модуля с примером использования | [Y-REPO-004](../docs/git/repository.md) · [G-PY-026](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-REPO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Длина строки | 120: вызов `logger.warning(...)` и длинные `:param:` помещаются в одну строку | 80: тот же вызов форматтер раскладывает по одному аргументу на строку, описания в докстринге переносятся с висячим отступом | [Y-PY-002](../docs/languages/python.md) · [G-PY-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Кавычки | двойные везде - так форматирует `ruff format` | один вид в пределах файла; здесь одинарные, как в примерах гайда; докстринги всегда в `"""` | [Y-PY-004](../docs/languages/python.md) · [G-PY-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Форматтер | `ruff format` | pyink (основной набор) или `ruff format` (вариант B) | [Y-PY-001](../docs/languages/python.md) · [G-PY-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Что импортируют | `from dataclasses import dataclass` - импорт имён допустим, правила нет | только пакеты и модули: `import dataclasses` и `dataclasses.dataclass`; исключение - `collections.abc` и `typing` | правила нет · [G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Порядок импортов | PEP 8 через `ruff I001`: внутри группы сначала `import …`, затем `from …` | лексикографически по пути модуля независимо от формы: `from collections.abc` стоит раньше `import dataclasses` | [Y-PY-011](../docs/languages/python.md) · [G-PY-021](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Внутренняя константа | `MAX_DELAY_SECONDS` - о подчёркивании для внутренних имён правила нет | `_MAX_DELAY_SECONDS` | [Y-PY-009](../docs/languages/python.md) · [G-PY-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| `TypeVar` | `T = TypeVar("T")` - правила нет | `_T = TypeVar('_T')`: короткое имя только у приватной переменной без ограничений | правила нет · [G-PY-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Исключения | своя иерархия с базовым классом `RetryError` | наследник существующего класса с именем на `Error`; общего базового класса модуля не требуется | [Y-PY-026](../docs/languages/python.md) · [G-PY-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Докстринги | reST-поля `:param:`, `:return:`, `:raises:`; наличие и формат инструмент не проверяет | секции `Args:`, `Returns:`, `Raises:`, `Attributes:`; первая строка - глагол в третьем лице; формат проверяет `ruff D` с `convention = "google"`, докстринг нужен и у `__init__` | [Y-PY-020](../docs/languages/python.md), [Y-PY-021](../docs/languages/python.md) · [G-PY-027](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-028](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-031](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Логирование | `logger = logging.getLogger(__name__)` один на модуль; ленивые аргументы через `%s` | функции модуля `logging` вызываются напрямую, как в примерах гайда (правила о логгере модуля нет); ленивый `%`-шаблон, значения выделены `%r` | [Y-PY-027](../docs/languages/python.md), [Y-PY-028](../docs/languages/python.md) · [G-PY-039](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-038](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| TODO | `# TODO(ivanov): …` - логин автора в скобках | `# TODO: <ссылка> - <текст>` (редакция гайда 2026-09-10; с 2026-10-15 гайд вернулся к `# TODO(<ссылка>): <текст>`, см. G-PY-034); имя человека контекстом не служит | [Y-PY-024](../docs/languages/python.md) · [G-PY-034](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Аннотации типов | все функции аннотированы; mypy с `disallow_untyped_defs` | публичный API аннотирован, `disallow_untyped_defs` не включён; `disallow_any_generics` требует явных параметров дженериков (`Callable[[], _T]`) | [Y-PY-031](../docs/languages/python.md), [Y-PY-032](../docs/languages/python.md) · [G-PY-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-045](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Версия Python и синтаксис типов | база 3.10: `Exception \| None`, `tuple[…]` без `from __future__ import annotations` | в конфиге 3.12 - наименьшая версия, на которой работают все примеры гайда; тот же синтаксис | [Y-PY-046](../docs/languages/python.md), [Y-PY-047](../docs/languages/python.md), [Y-PY-015](../docs/languages/python.md) · [G-PY-043](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-044](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Где лежит тест | `tests/test_retry.py` - отдельный каталог | `ratelimit/retry_test.py` - рядом с модулем | [Y-PY-040](../docs/languages/python.md) · [G-PY-061](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Имена тестов | `test_gives_up_after_max_attempts` - правила об именах функций сверх `test_*.py` нет | `test_run_with_retry_gives_up_after_max_attempts`: шаблон `test_<что>_<состояние>` | правила нет · [G-PY-062](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Импорт в тесте | `from ratelimit.retry import RetriesExhaustedError, RetryPolicy, run_with_retry` | `from ratelimit import retry` и обращения `retry.RetryPolicy` | правила нет · [G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Настройки pytest | `testpaths = ["tests"]`, `--strict-markers`, `-ra` | `python_files = ["*_test.py", "test_*.py"]`, `filterwarnings = ["error"]` | [Y-PY-040](../docs/languages/python.md), [Y-PY-042](../docs/languages/python.md) · [G-PY-061](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-065](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Инструменты за кадром | ruff как форматтер и линтер (ядро Аркадии `E4`, `E7`, `E9`, `F`, `W` плюс `I`, `UP`, `B`, `N`, `RUF`, `G`, `LOG`), mypy, pytest | pyink, isort с профилем `google`, pylint с `pylintrc` из google/styleguide, ruff как дополнение, mypy вместо архивного pytype, pytest | [Y-PY-036](../docs/languages/python.md) · [G-PY-048](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |

### Почему так

Главное содержательное различие - правило импорта. Гайд Google требует импортировать пакеты и модули, а не имена из них, чтобы по записи `retry.RetryPolicy` читатель сразу видел, где определён класс ([G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); отсюда `import dataclasses` и `dataclasses.dataclass` вместо привычного `from dataclasses import dataclass`. Публичной проверки у этого правила нет: гайд упоминает внутренние проверки pylint с префиксом `g-`, но они не опубликованы, и в примере это держится только на ревью. В Python-коде Яндекса такого правила нет вообще - там действует PEP 8, и профиль фиксирует лишь порядок импортов ([Y-PY-011](../docs/languages/python.md)).

Формат докстрингов показывает разницу в происхождении правил. У Google это точная спецификация с секциями, которую можно проверить инструментом (`ruff D` с `convention = "google"`), и профиль требует докстринг даже у `__init__`. У Яндекса единого формата нет: reST-поля - реконструкция по четырём SDK (YDB, YTsaurus, Yandex Cloud, AI Studio), а исследовательские репозитории YaFSDP и tabm пишут докстринги как раз в формате Google ([Y-PY-021](../docs/languages/python.md), уверенность средняя). Интерпретация: «Google-стиль докстрингов» давно стал общеотраслевым форматом и живёт в коде Яндекса независимо от гайда Google; выбор reST в профиле Яндекса - выбор формата большинства SDK, а не правило компании.

Третье различие - в том, что строже: текст или инструмент. Профиль Яндекса требует аннотации у всех функций и проверяет это mypy с `disallow_untyped_defs`, хотя единственный письменный гайд (YTsaurus) говорит только о публичных методах: правило взято по инструменту, потому что соблюдается лишь там, где его проверяет mypy ([Y-PY-031](../docs/languages/python.md)). У Google наоборот: гайд строже своих инструментов - обязательные докстринги функций и порядок импортов `pylintrc` не проверяет, их закрывают isort и ruff, оба «не Google» ([G-PY-048](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), раздел 11 профиля). Длина строки 80 против 120 - различие заметное, но наименее содержательное: оба профиля отдают её форматтеру и не обсуждают на ревью ([Y-PY-001](../docs/languages/python.md), [G-PY-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)).

## 3. Компонент интерфейса

**Задача.** Маленький компонент «тег»: текст, два размера, состояние «выключен», необязательная кнопка удаления с событием наружу, стили. У Яндекса он написан на React с Gravity UI и БЭМ-классами, у Google - на Angular.

**Почему фреймворки разные.** Профили сравнивают то, для чего у компаний есть собственные правила. У Яндекса публичные правила веба - это конфиги и проектные гайды Gravity UI, библиотеки на React; публичного гайда по Angular у Яндекса нет, и правила области `Y-NG` в профиле целиком взяты из гайда самого Angular ([react.md](../docs/frameworks/react.md), раздел 1; [angular.md](../docs/frameworks/angular.md) профиля Яндекса). У Google наоборот: стайлгайд Angular - собственный документ компании, перечисленный в README google/styleguide, а правил для React у Google нет, и область `G-REACT` построена на документации react.dev ([angular.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), раздел «Источник и его статус»; [react.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md) профиля Google). Поэтому честная пара - «React по Яндексу» против «Angular по Google», а не один фреймворк в двух стилях.

### Версия Яндекса

Состав папки `src/components/Tag/` (хелпер `src/utils/cn.ts` с `withNaming({n: 'app-', e: '__', m: '_'})` и `src/components/variables.scss` с `$ns: 'app-'` - общие для проекта, здесь не показаны):

```text
src/components/Tag/
├── Tag.tsx
├── Tag.scss
├── index.ts
├── i18n/en.json
├── i18n/ru.json
├── i18n/index.ts
├── __tests__/Tag.test.tsx
└── __stories__/Tag.stories.tsx
```

`Tag.tsx`:

```tsx
import {Xmark} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {block} from '../../utils/cn';

import {i18n} from './i18n';

import './Tag.scss';

const b = block('tag');

export type TagSize = 's' | 'm';

export interface TagProps {
    /** Text shown inside the tag */
    text: string;
    /** Tag size */
    size?: TagSize;
    /** Disables the remove button */
    disabled?: boolean;
    /** Called when the remove button is clicked; without it the button is not rendered */
    onRemove?: () => void;
    /** Additional CSS class for the root element */
    className?: string;
    /** Value of the `data-qa` attribute used by tests */
    qa?: string;
}

export function Tag({text, size = 's', disabled = false, onRemove, className, qa}: TagProps) {
    return (
        <span className={b({size, disabled}, className)} data-qa={qa}>
            <span className={b('text')}>{text}</span>
            {onRemove ? (
                <Button
                    className={b('remove')}
                    view="flat"
                    size={size}
                    disabled={disabled}
                    onClick={onRemove}
                    extraProps={{'aria-label': i18n('action_remove')}}
                >
                    <Icon data={Xmark} size={12} />
                </Button>
            ) : null}
        </span>
    );
}
```

`Tag.scss`:

```scss
@use '../variables';

$block: '.#{variables.$ns}tag';

#{$block} {
    --_--height: 24px;

    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: var(--app-tag-height, var(--_--height));
    padding-inline: 8px;
    color: var(--g-color-text-primary);
    border-radius: var(--g-border-radius-s);
    background-color: var(--g-color-base-generic);

    &__text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &_size {
        &_m {
            --_--height: 28px;
        }
    }

    &_disabled {
        color: var(--g-color-text-secondary);
    }
}
```

`index.ts`, `i18n/en.json` и `i18n/ru.json` (`i18n/index.ts` регистрирует кейсеты так, как принято в библиотеке i18n проекта, и здесь не показан):

```ts
export {Tag} from './Tag';
export type {TagProps, TagSize} from './Tag';
```

```json
{
  "action_remove": "Remove"
}
```

```json
{
  "action_remove": "Удалить"
}
```

`__tests__/Tag.test.tsx`:

```tsx
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Tag} from '../Tag';

test('calls onRemove when the remove button is clicked', async () => {
    const onRemove = jest.fn();
    render(<Tag text="alpha" onRemove={onRemove} qa="tag" />);

    await userEvent.click(screen.getByRole('button', {name: 'Remove'}));

    expect(onRemove).toHaveBeenCalledTimes(1);
});
```

### Версия Google

Состав каталога `src/catalog/tag/` - каталог функциональной области, а не типа кода:

```text
src/catalog/tag/
├── tag.ts
├── tag.html
├── tag.css
└── tag.spec.ts
```

`tag.ts`:

```ts
// Copyright 2026 The Ratelimit Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

export type TagSize = 's' | 'm';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrl: './tag.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tag-size-m]': 'size() === "m"',
    '[class.tag-disabled]': 'disabled()',
  },
})
export class Tag {
  readonly text = input.required<string>();
  readonly size = input<TagSize>('s');
  readonly disabled = input(false);
  readonly removable = input(false);
  readonly removed = output<void>();

  protected remove(): void {
    if (!this.disabled()) {
      this.removed.emit();
    }
  }
}
```

`tag.html`:

```html
<span class="tag-text">{{ text() }}</span>
@if (removable()) {
  <button
    type="button"
    class="tag-remove"
    aria-label="Remove"
    [disabled]="disabled()"
    (click)="remove()"
  >
    &times;
  </button>
}
```

`tag.css` (лицензионный заголовок в блочном комментарии `/* … */` опущен):

```css
:host {
  align-items: center;
  background: #eee;
  border-radius: 4px;
  display: inline-flex;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
}

:host(.tag-size-m) {
  height: 28px;
}

:host(.tag-disabled) {
  color: #888;
}

.tag-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-remove {
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}
```

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Фреймворк и откуда правила | React с Gravity UI; правила реконструированы по конфигам Gravity UI и проектным гайдам (uikit, ydb-embedded-ui) | Angular; собственный стайлгайд Angular (редакция 2025) поверх Google TypeScript Style Guide | [react.md](../docs/frameworks/react.md), раздел 1 · [angular.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), «Источник и его статус» |
| Где лежит компонент | `src/components/Tag/` - папка на компонент со всеми технологиями: код, стили, тесты, истории, i18n | `src/catalog/tag/` - каталог по функциональной области, не по типу кода; код, шаблон, стили и тест с общим базовым именем | [Y-REACT-014](../docs/frameworks/react.md), [Y-REACT-017](../docs/frameworks/react.md) · [G-NG-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Имена файлов и класса | `Tag.tsx` - по имени компонента | `tag.ts`, `tag.html`, `tag.css` через дефис, без суффикса типа; класс `Tag`, а не `TagComponent` | [Y-REACT-014](../docs/frameworks/react.md) · [G-NG-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Лицензионный заголовок | нет | в `.ts` и `.css`; для шаблона `.html` профиль формы заголовка не задаёт (правила нет) | [Y-REPO-004](../docs/git/repository.md) · [G-REPO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Форматирование | Prettier: 4 пробела, ширина 100, одинарные кавычки, `{a}` без пробелов; в JSX-атрибутах - двойные | Prettier: 2 пробела, ширина 100 (как у Angular CLI; у gts - 80), одинарные кавычки, `{a}` без пробелов, `arrowParens: avoid`; в HTML - двойные кавычки | [Y-TS-001](../docs/languages/other.md), [Y-REACT-012](../docs/frameworks/react.md) · [G-TS-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-TS-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-CSS-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Форма компонента | функция без `React.FC`; пропсы - экспортируемый `interface TagProps` с JSDoc у каждого поля, значения по умолчанию через деструктуризацию | класс с `@Component`; входы - сигнальные `input()` и `input.required()`, помеченные `readonly`; значение по умолчанию - аргумент `input('s')` | [Y-REACT-001](../docs/frameworks/react.md), [Y-REACT-002](../docs/frameworks/react.md) · [G-NG-032](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Набор вариантов `size` | объединение строковых литералов, не `enum` | то же объединение; о выборе между литералами и `enum` правила нет (запрещён только `const enum`) | [Y-REACT-003](../docs/frameworks/react.md) · правила нет |
| Экспорт | именованный; `index.ts` реэкспортирует значение и отдельной инструкцией - типы | именованный; `export default` запрещён; о barrel-файлах гайд молчит | [Y-REACT-004](../docs/frameworks/react.md), [Y-REACT-016](../docs/frameworks/react.md) · [G-TS-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) |
| Событие удаления | колбэк `onRemove?: () => void`; кнопка есть, только если колбэк передан | `readonly removed = output<void>()` - без префикса `on`, не совпадает с событием DOM; видимость кнопки - отдельный вход `removable` | правила нет (имена колбэков) · [G-NG-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-023](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Обработчик клика | `onClick={onRemove}` - колбэк передаётся как есть | метод назван по действию, `remove()`, а не `onClick()`; нужен только шаблону, поэтому `protected` | правила нет · [G-NG-025](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Классы CSS | БЭМ: `app-tag`, `app-tag__text`, `app-tag_size_m`, `app-tag_disabled`; имена создаёт хелпер `block()` из `@bem-react/classname`, вручную строки не собираются; префикс проекта `app-` | дефисы и назначение: `tag-text`, `tag-remove`, `tag-size-m`; запись БЭМ с подчёркиваниями не допускается; классы хоста - через `host` с `[class.…]`, а не `@HostBinding` | [Y-CSS-001](../docs/frameworks/react.md), [Y-CSS-003](../docs/frameworks/react.md), [Y-CSS-004](../docs/frameworks/react.md) · [G-CSS-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-028](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Файл стилей | один `Tag.scss`; вложенность повторяет БЭМ-дерево (`&__text`, `&_size { &_m }`); корень через `#{$block}` с переменной `$ns` | обычный `tag.css`, как создаёт Angular CLI; селекторы `:host` и `:host(.tag-size-m)`; о препроцессоре правила нет | [Y-CSS-005](../docs/frameworks/react.md) · [G-NG-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Цвета и размеры | только семантические токены темы Gravity UI; внутренняя переменная `--_--height` и публичная `--app-tag-height` с запасным значением | значения записаны прямо; hex-цвет в короткой форме (`#eee`), ноль без единицы; о дизайн-токенах правила нет | [Y-CSS-009](../docs/frameworks/react.md), [Y-CSS-013](../docs/frameworks/react.md) · [G-CSS-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Порядок деклараций | группами: отображение и flex → блочная модель → типографика → оформление (`stylelint-order`, конфиг `/order`) | по алфавиту, пока нет автоматической сортировки: `align-items`, `background`, `border-radius`, … | [Y-CSS-011](../docs/frameworks/react.md) · [G-CSS-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Отступы по горизонтали | логическое свойство `padding-inline: 8px` | сокращённое `padding: 0 8px`; о логических свойствах правила нет | [Y-CSS-012](../docs/frameworks/react.md) · [G-CSS-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Тексты для пользователя | `aria-label` из i18n-ресурсов компонента `i18n/en.json`, `i18n/ru.json`; ключ `action_remove` по схеме `<контекст>_<содержание>` | `aria-label="Remove"` прямо в шаблоне; требования хранить тексты в ресурсах в профиле нет, встроенный i18n Angular - вне правил | [Y-REACT-019](../docs/frameworks/react.md), [Y-REACT-020](../docs/frameworks/react.md) · правила нет |
| Готовые компоненты | кнопка и иконка - `Button`, `Icon`, `Xmark` из Gravity UI; свои аналоги не пишут | нативная `<button type="button">`; библиотеку компонентов профиль не предписывает | [Y-REACT-007](../docs/frameworks/react.md) · правила нет |
| Доступность | правила `jsx-a11y` из конфига `/a11y` | пресет `templateAccessibility` angular-eslint; альтернативный текст у мультимедиа | [Y-REACT-013](../docs/frameworks/react.md) · [G-CSS-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Специфика фреймворка | хуки только на верхнем уровне, полные массивы зависимостей (в этом компоненте хуков нет) | `OnPush` явно; `standalone` не пишут; `@if` вместо `*ngIf` | [Y-REACT-008](../docs/frameworks/react.md), [Y-REACT-009](../docs/frameworks/react.md) · [G-NG-029](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-030](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-031](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Тест | `__tests__/Tag.test.tsx`; Jest и Testing Library; элементы ищут по роли и по `data-qa` | `tag.spec.ts` рядом с компонентом (здесь не показан) | [Y-REACT-017](../docs/frameworks/react.md), [Y-REACT-006](../docs/frameworks/react.md) · [G-NG-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) |
| Инструменты | ESLint 9 с `@gravity-ui/eslint-config` (точки входа `client`, `prettier`, `import-order`, `a11y`), Stylelint 16 с `@gravity-ui/stylelint-config`, Prettier 3 | ESLint 10 с typescript-eslint и angular-eslint (правила gts перенесены поштучно), Prettier 3, Stylelint 17 со встроенными правилами по HTML/CSS-гайду | [react.md](../docs/frameworks/react.md), раздел 5 · [angular.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), «Конфигурационные файлы» |

### Почему так

Главная разница в этой паре - не React против Angular, а два ответа на один вопрос: как назвать CSS-класс. Профиль Яндекса кодирует в имени структуру - блок, элемент, модификатор и его значение (`app-tag__text`, `app-tag_size_m`), и имена порождает хелпер, а не человек ([Y-CSS-001](../docs/frameworks/react.md), [Y-CSS-003](../docs/frameworks/react.md)). Это прямое наследие методологии БЭМ - собственной разработки Яндекса (репозиторий bem-method ведёт команда БЭМ Яндекса); в React-коде Gravity UI от неё остались схема имён и принцип «один компонент - одна папка», а уровни переопределения и i-bem.js не используются (раздел 4.1 [react.md](../docs/frameworks/react.md)). HTML/CSS-гайд Google требует противоположного - имена через дефис, по назначению, и прямо говорит, что запись с подчёркиваниями ему не соответствует ([G-CSS-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Интерпретация: БЭМ решает проблему глобального пространства имён CSS соглашением об именах, а Angular - инкапсуляцией стилей компонента на уровне фреймворка, поэтому гайду Google достаточно требования читаемости имени; в React без инкапсуляции префикс блока остаётся единственной защитой от совпадений, что и объясняет правило о префиксе пакета ([Y-CSS-004](../docs/frameworks/react.md)).

Вторая разница - где живут тексты и цвета. У Яндекса оба вынесены из кода: подписи - в `i18n/*.json` с типизированными ключами, цвета - в семантические токены темы ([Y-REACT-019](../docs/frameworks/react.md), [Y-CSS-009](../docs/frameworks/react.md)); это инварианты библиотеки uikit, которую подключают сотни сервисов с разными темами и языками. Стайлгайд Angular и HTML/CSS-гайд Google об этом молчат: они описывают язык и фреймворк, а не продуктовую инфраструктуру. Поэтому версия Google короче и «сырее» - не потому что Google против токенов и локализации, а потому что в публичных правилах их нет.

Третья - степень автоматизации. Правила Angular в большинстве проверяет angular-eslint (12 из 32 полностью), а имена файлов и структуру каталогов задают генераторы CLI: пока код создаётся через `ng generate`, правила [G-NG-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-NG-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) соблюдаются сами ([angular.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), «Что из этого проверяет линтер»). У Яндекса самые характерные правила - БЭМ-имена, папка компонента, i18n, токены - линтером не проверяются вовсе (16 из 35 только на ревью, раздел 7 [react.md](../docs/frameworks/react.md)); схему имён удерживает не линтер, а то, что класс нельзя написать иначе, чем через `block()`. Интерпретация: правило, встроенное в API хелпера или генератора, держится лучше правила в тексте - и оба профиля этим пользуются, только Яндекс через библиотеку, а Google через инструменты фреймворка.

## 4. Сообщение коммита и описание PR

**Задача.** Одно и то же изменение - в `RetryPolicy` из второй пары добавлен флаг `jitter`, который умножает задержку на случайный коэффициент, чтобы клиенты не повторяли запросы синхронно. Изменение закрывает issue #57 и сливается через pull request со squash. Нужно сообщение коммита (при squash - оно же заголовок и описание PR) и описание PR по шаблону профиля.

### Версия Яндекса

Сообщение коммита (при squash-слиянии GitHub дописывает к заголовку номер PR, например ` (#61)`):

```text
feat(retry): add jitter to backoff delays [#57]

Synchronized clients retried at the same moments and overloaded the
backend after every restart. Multiply each delay by a random factor in
[0.5, 1.5) when `RetryPolicy.jitter` is set; the option is off by
default, so existing configs keep their exact delays.

Tests: unit test on the delay range with a fixed seed; manual run of
the sync CLI against a staging backend with 50 clients.
```

Pull request. Заголовок - тот же, что заголовок коммита: `feat(retry): add jitter to backoff delays [#57]`. Описание - по [шаблону профиля](../templates/github/PULL_REQUEST_TEMPLATE.md); раздел «Changelog entry» удалён, потому что в этом репозитории release notes собирает release-please из заголовков коммитов:

```markdown
## Description

Clients that restart together retry at the same moments and overload the backend after every
outage (#57). This PR adds an optional `jitter` flag to `RetryPolicy`: when it is set, each delay is
multiplied by a random factor in [0.5, 1.5). The flag is off by default, so existing configs keep
their exact delays.

Related issue: fixes #57

## How to test

    pytest tests/test_retry.py -k jitter

Manual check: run `sync-cli --retry-jitter` against staging with 50 parallel clients and watch the
request rate on the backend dashboard. Retries no longer arrive in bursts.
```

### Версия Google

Сообщение коммита в формате по умолчанию профиля (содержание - по eng-practices, форма - по cbea.ms):

```text
Add jitter to retry backoff delays

Clients that restarted together retried at the same moments and
overloaded the backend after every outage. Multiply each delay by a
random factor in [0.5, 1.5) when RetryPolicy.jitter is set. The flag
is off by default, so existing configurations keep their exact delays.

Only the delay changes; the number of attempts and the cap of 30 s
stay the same. A unit test checks the range of the jittered delay
with a fixed seed.

Fixes #57
```

Pull request. Заголовок - первая строка коммита: `Add jitter to retry backoff delays`. Описание - по [шаблону профиля](https://github.com/k1sur1n/google-codestyle/blob/main/templates/github/PULL_REQUEST_TEMPLATE.md) из `google/new-project`: строка `Fixes #N`, текст, который станет телом squash-коммита, и чек-лист:

```markdown
Fixes #57

Clients that restarted together retried at the same moments and overloaded the backend after every
outage. Multiply each delay by a random factor in [0.5, 1.5) when `RetryPolicy.jitter` is set. The
flag is off by default, so existing configurations keep their exact delays.

Only the delay changes; the number of attempts and the cap of 30 s stay the same. A unit test checks
the range of the jittered delay with a fixed seed.

- [x] Tests pass
- [x] Appropriate changes to documentation are included in the PR
- [x] New source files have the license header
```

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Формат заголовка | Conventional Commits: `<type>(<scope>): <описание>` | предложение-приказ без префикса; Conventional Commits - только в репозитории с release-please | [Y-GIT-002](../docs/git/commits.md), [Y-GIT-004](../docs/git/commits.md) · [G-GIT-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Тип изменения | обязателен, из списка `config-conventional`; `feat` поднимает минорную версию | тега нет; если команда вводит тег, он короткий и одного вида во всём репозитории | [Y-GIT-003](../docs/git/commits.md), [Y-REL-005](../docs/git/releases.md) · [G-GIT-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Первая буква и точка | описание со строчной буквы (`add`), без точки | с заглавной (`Add`), без точки | [Y-GIT-005](../docs/git/commits.md) · [G-GIT-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Глагол | повелительное наклонение | повелительное наклонение: «Add», а не «Added» или «Adds» | [Y-GIT-007](../docs/git/commits.md) · [G-GIT-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Длина заголовка | до 72, ориентир около 50 (здесь 47); проверяет хук или commitlint | до 72, ориентир 50 (здесь 34); проверяет commitlint | [Y-GIT-006](../docs/git/commits.md) · [G-GIT-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Ссылка на задачу | `[#57]` в конце заголовка; в описании PR - `fixes #57` в поле «Related issue» | трейлер `Fixes #57` последним абзацем тела; в PR - первой строкой из шаблона | [Y-GIT-008](../docs/git/commits.md), [Y-REPO-014](../docs/git/repository.md) · [G-GIT-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Тело | пустая строка, затем что и зачем; для нетривиального изменения - как проверено (`Tests:`) | пустая строка (MUST), затем проблема, подход и его ограничения («Only the delay changes…»); перенос строк на 72 | [Y-GIT-009](../docs/git/commits.md) · [G-GIT-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Что проверяет CI | заголовок PR при squash: job «PR Title» с commitlint или shell-хук профиля; тот же хук локально в `commit-msg` | заголовок PR и коммиты через commitlint с собственным набором правил профиля; у Google публичной проверки нет - инструмент «не Google» | [Y-GIT-013](../docs/git/commits.md) · [G-GIT-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), раздел «Проверка: commitlint (не Google)» в [commits.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Шаблон PR | разделы «Description», «Related issue», «How to test»; «Changelog entry» - только если release notes пишут вручную | `Fixes #N`, текст, чек-лист из трёх пунктов: тесты, документация, лицензионный заголовок в новых файлах | [Y-REPO-014](../docs/git/repository.md), [Y-REL-008](../docs/git/releases.md) · [G-REPO-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Связь PR и коммита | заголовок PR оформляется как заголовок коммита; при squash именно он попадает в историю | заголовок и описание PR оформляются как сообщение коммита; перед слиянием описание перечитывают | [Y-BR-006](../docs/git/branches.md), [Y-BR-005](../docs/git/branches.md) · [G-GIT-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-BR-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/branches.md) |
| Changelog | собирает release-please из заголовков `feat` и `fix`; человек сливает релизный PR | в формате по умолчанию - вручную или заметки к релизу на хостинге; release-please - только в варианте Conventional Commits | [Y-REL-004](../docs/git/releases.md) · [G-REL-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md), [G-REL-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/releases.md) |
| Язык | английский; хук отклоняет кириллицу | английский - практика 24 из 24 репозиториев, письменного правила нет | [Y-GIT-001](../docs/git/commits.md) · [G-GIT-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |
| Служебные трейлеры | только общепринятые (`Co-authored-by:`, `Refs:`); строки экспорта из Аркадии (`commit_hash:`) вручную не пишут | только те, что читает инструмент репозитория; `PiperOrigin-RevId:` - след экспорта, в обычный репозиторий не переносится; `Signed-off-by` не требуется | [Y-GIT-012](../docs/git/commits.md) · [G-GIT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) |

Перекрёстная проверка показывает разницу наглядно: shell-хук профиля Яндекса принял сообщение Яндекса и отклонил сообщение Google с диагностикой «ожидается `<type>(<scope>): <описание>`»; правила commitlint из профиля Google приняли сообщение Google, а на сообщении Яндекса сработало `header-case` (в конфиге профиля это предупреждение, не ошибка). Остальное - 72 символа, пустая строка, повелительное наклонение, отсутствие точки - оба сообщения выполняют одинаково.

### Почему так

Оба профиля - реконструкции: ни у Яндекса, ни у Google нет единого письменного формата коммитов. У Яндекса в 25 открытых репозиториях четыре стиля, и профиль берёт Conventional Commits, потому что это единственный формат, который где-то записан (Gravity UI, Diplodoc, YTsaurus UI), проверяется инструментом и питает автоматический релиз ([commits.md](../docs/git/commits.md), «Выбор профиля»). Интерпретация авторов того документа, которую стоит повторить здесь: стиль коммитов определяется устройством релизов, а не вкусом команды - где версию и changelog собирает release-please, формат обязателен; где изменения едут из монорепозитория с трекером, заголовок начинается с ключа тикета (`YT-29880:`); где release notes пишут руками, формат свободный.

У Google формат собран из двух слоёв: eng-practices описывает содержание описания CL - короткая первая строка-приказ, затем «что и почему» - и не называет ни одного числа, а форму (50/72, заглавная буква, без точки) README стайлгайдов с 2025-01-17 отдаёт сторонней статье cbea.ms ([G-GIT-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [G-GIT-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)). Поэтому версия Google не содержит типа: Conventional Commits в профиле - отдельный вариант для репозиториев с release-please ([G-GIT-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md)), а в экспортируемых из монорепозитория проектах (abseil-cpp, guava, tensorflow) префикс типа встречается в 1 % коммитов. Интерпретация: обе компании внутри работают не в git, и их внешние форматы коммитов - производные от внутренних описаний изменений (CL у Google, описание PR в Аркадии у Яндекса - поля `Tests:` и `Validation:` в коммитах userver оттуда); следы этого видны в трейлерах экспорта `PiperOrigin-RevId:` и `commit_hash:`, которые оба профиля просят не воспроизводить вручную ([G-GIT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md), [Y-GIT-012](../docs/git/commits.md)).

Сходства важнее различий: оба требуют английский, пустую строку после заголовка, повелительное наклонение, предел 72 символа и ссылку на задачу, и оба опираются на один сторонний инструмент - commitlint, который ни одна из компаний не публикует как свой. Разница сводится к одному решению: кодировать ли тип изменения в заголовке. Яндекс (в лице Gravity UI) кодирует и получает автоматический changelog; Google по умолчанию не кодирует и получает заголовок, который читается как предложение. Подробнее о ветках, ревью и релизах - в [repository.md](repository.md).

## 5. Конфиг и скрипт обучения ML-модели

**Задача.** Бинарная классификация на табличных данных: по трём числовым признакам и двум категориальным (`city`, `device`) предсказать, сконвертируется ли пользователь. Данные лежат в трёх CSV (`train`, `valid`, `test`). Нужны конфиг запуска и скрипт, который обучает модель, выбирает число итераций по валидации, сохраняет модель, логи и метрики и оставляет след, по которому запуск можно повторить. У Яндекса это CatBoost и раскладка исследовательских репозиториев `yandex-research`; у Google - Keras 3 с absl и ml_collections, как в примерах Flax.

Библиотек ML в среде сборки нет, поэтому оба скрипта проверены только статически: компиляция, линтер и форматтер по конфигу профиля, mypy и pyright с заглушками недостающих модулей. Поведение CatBoost и Keras при запуске - **не запускалось**.

### Версия Яндекса

Раскладка: `scripts/train.py` - исполняемый скрипт, `experiments/catboost/baseline/0.json` - конфиг запуска, результат - каталог `experiments/catboost/baseline/0/` рядом с конфигом (`report.json`, `DONE`, `model.cbm`, `catboost_info/`); в git из него попадают только `report.json` и `DONE` (белый список в `.gitignore`).

`experiments/catboost/baseline/0.json`:

```json
{
  "seed": 0,
  "od_wait": 100,
  "data": {"path": "data/processed/signups"},
  "model": {"iterations": 5000, "depth": 6, "task_type": "CPU", "border_count": 254}
}
```

`scripts/train.py`:

```python
"""Train a CatBoost classifier from one run config and write report.json next to it.

Usage: python scripts/train.py experiments/catboost/baseline/0.json [--force]
"""

import argparse
import json
import logging
import platform
import subprocess
import time
from pathlib import Path
from typing import Any

import catboost
import pandas as pd
from catboost import CatBoostClassifier, Pool

logger = logging.getLogger(__name__)

CATEGORICAL_FEATURES = ["city", "device"]
NUMERIC_FEATURES = ["age", "sessions_30d", "spend_90d"]
TARGET = "converted"


def load_pool(path: Path) -> Pool:
    """Read one split from CSV and build a CatBoost pool.

    :param path: path to a CSV file with the feature columns and ``converted``.
    :return: pool with categorical features declared by name.
    """
    frame = pd.read_csv(path)
    for column in CATEGORICAL_FEATURES:
        # CatBoost hashes the string form of a category: no floats, no NaN.
        frame[column] = frame[column].fillna("unknown").astype(str).astype("category")
    features = frame[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    return Pool(features, frame[TARGET], cat_features=CATEGORICAL_FEATURES)


def git_commit() -> str:
    """Return the hash of the current commit."""
    result = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True)
    return result.stdout.strip()


def train(config: dict[str, Any], output_dir: Path) -> dict[str, Any]:
    """Train the model described by ``config`` and return the run report.

    :param config: contents of the run config (JSON).
    :param output_dir: directory for the model, the training logs and the report.
    :return: report with the full config, metrics on train, val and test and run details.
    """
    data_dir = Path(config["data"]["path"])
    train_pool = load_pool(data_dir / "train.csv")
    valid_pool = load_pool(data_dir / "valid.csv")
    test_pool = load_pool(data_dir / "test.csv")

    # CatBoost is the only source of randomness here; the seed comes from the config.
    model = CatBoostClassifier(
        **config["model"],
        random_seed=config["seed"],
        eval_metric="AUC",
        od_type="Iter",
        od_wait=config["od_wait"],
        use_best_model=True,
        train_dir=str(output_dir / "catboost_info"),
        verbose=False,
    )
    started = time.monotonic()
    model.fit(train_pool, eval_set=valid_pool)
    model.save_model(str(output_dir / "model.cbm"))

    best_score = model.get_best_score()
    test_scores = model.eval_metrics(test_pool, ["Logloss", "AUC"])
    return {
        "function": "scripts.train.train",
        "commit": git_commit(),
        "catboost_version": catboost.__version__,
        "host": platform.node(),
        "task_type": config["model"]["task_type"],
        "config": config,
        "best_iteration": model.get_best_iteration(),
        "metrics": {
            "train": best_score["learn"],
            "val": best_score["validation"],
            "test": {name: values[-1] for name, values in test_scores.items()},
        },
        "time": round(time.monotonic() - started, 1),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("config", type=Path, help="run config, e.g. experiments/catboost/baseline/0.json")
    parser.add_argument("--force", action="store_true", help="overwrite a finished run")
    args = parser.parse_args()

    output_dir = args.config.with_suffix("")
    if (output_dir / "DONE").exists() and not args.force:
        raise SystemExit(f"{output_dir} is already finished; pass --force to overwrite it")
    output_dir.mkdir(parents=True, exist_ok=True)

    config = json.loads(args.config.read_text())
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logger.info("Training %s into %s", args.config, output_dir)

    report = train(config, output_dir)
    (output_dir / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    (output_dir / "DONE").touch()
    logger.info("Validation AUC %.4f, test AUC %.4f", report["metrics"]["val"]["AUC"], report["metrics"]["test"]["AUC"])


if __name__ == "__main__":
    main()
```

Оговорка о формате конфига. Профиль Яндекса берёт TOML как самый частый формат в `yandex-research` и называет JSON равноправным вариантом ([Y-ML-009](../docs/ml/project-structure.md)). Здесь взят JSON, потому что стандартный читатель TOML - модуль `tomllib` - появился в Python 3.11, а нижняя версия Python-профиля - 3.10 ([Y-PY-046](../docs/languages/python.md)); с `target-version = "py310"` в конфиге профиля ruff и вовсе относит `tomllib` к сторонним пакетам и требует переставить импорт. В проекте на Python 3.11 и новее TOML работает без оговорок.

### Версия Google

Раскладка - как в примерах Flax: `configs/default.py` с `get_config()`, короткий `tabular/main.py` с флагами, вся логика в `tabular/train.py` (тест `tabular/train_test.py` рядом с ним здесь не показан). Запуск: `python -m tabular.main --config=configs/default.py --workdir=/tmp/signups/run1`; любое поле переопределяется из командной строки, например `--config.learning_rate=0.0005`. Лицензионные заголовки в трёх файлах опущены.

`configs/default.py`:

```python
"""Default hyperparameters for the sign-up conversion model."""

import ml_collections


def get_config() -> ml_collections.ConfigDict:
    """Returns the default configuration."""
    config = ml_collections.ConfigDict()
    config.seed = 0
    config.data_dir = 'data/processed/signups'
    config.hidden_units = 64
    config.dropout = 0.1
    config.learning_rate = 1e-3
    config.batch_size = 256
    config.max_epochs = 50
    config.patience = 5
    return config
```

`tabular/main.py`:

```python
"""Entry point: parses flags and runs training."""

from collections.abc import Sequence

from absl import app
from absl import flags
from ml_collections import config_flags

from tabular import train

_WORKDIR = flags.DEFINE_string(
    'workdir', None, 'Directory for run outputs.', required=True
)
_CONFIG = config_flags.DEFINE_config_file(
    'config', None, 'Path to the experiment configuration.', lock_config=True
)


def main(argv: Sequence[str]) -> None:
    """Runs training with the config and workdir given by flags."""
    if len(argv) > 1:
        raise app.UsageError('Too many command-line arguments.')
    train.train_and_evaluate(_CONFIG.value, _WORKDIR.value)


if __name__ == '__main__':
    flags.mark_flag_as_required('config')
    app.run(main)
```

`tabular/train.py`:

```python
"""Trains a Keras model that predicts sign-up conversion from tabular data."""

from collections.abc import Mapping, Sequence
import json
import os

from absl import logging
import keras
import ml_collections
import numpy as np
import pandas as pd

CATEGORICAL_FEATURES = ('city', 'device')
NUMERIC_FEATURES = ('age', 'sessions_30d', 'spend_90d')
TARGET = 'converted'


def load_split(path: str) -> tuple[dict[str, np.ndarray], np.ndarray]:
    """Reads one split of the dataset.

    Args:
        path: Path to a CSV file with the feature columns and the target.

    Returns:
        A tuple (features, labels). `features` maps a column name to an
        array of shape `[num_rows, 1]`: strings for categorical columns,
        float32 for numeric ones. `labels` is an int32 array of shape
        `[num_rows]`.
    """
    frame = pd.read_csv(path)
    features = {
        name: frame[[name]].fillna('unknown').to_numpy(dtype=str)
        for name in CATEGORICAL_FEATURES
    }
    for name in NUMERIC_FEATURES:
        features[name] = frame[[name]].to_numpy(dtype=np.float32)
    return features, frame[TARGET].to_numpy(dtype=np.int32)


def build_model(
    numeric_values: Mapping[str, np.ndarray],
    vocabularies: Mapping[str, Sequence[str]],
    hidden_units: int,
    dropout: float,
) -> keras.Model:
    """Builds the classifier.

    Args:
        numeric_values: Training values of each numeric feature, shape
            `[num_rows, 1]`; used to adapt the normalization layers.
        vocabularies: Known values of each categorical feature.
        hidden_units: Width of the hidden layer.
        dropout: Dropout rate applied after the hidden layer.

    Returns:
        An uncompiled model with one input per feature and a sigmoid
        output of shape `[batch, 1]`.
    """
    inputs = {}
    encoded = []
    for name, values in numeric_values.items():
        inputs[name] = keras.Input(shape=(1,), name=name, dtype='float32')
        normalizer = keras.layers.Normalization()
        normalizer.adapt(values)
        encoded.append(normalizer(inputs[name]))
    for name, vocabulary in vocabularies.items():
        inputs[name] = keras.Input(shape=(1,), name=name, dtype='string')
        lookup = keras.layers.StringLookup(
            vocabulary=list(vocabulary), output_mode='one_hot'
        )
        encoded.append(lookup(inputs[name]))
    hidden = keras.layers.Concatenate()(encoded)
    hidden = keras.layers.Dense(hidden_units, activation='relu')(hidden)
    hidden = keras.layers.Dropout(dropout)(hidden)
    output = keras.layers.Dense(1, activation='sigmoid')(hidden)
    return keras.Model(inputs=inputs, outputs=output)


def train_and_evaluate(
    config: ml_collections.ConfigDict, workdir: str
) -> dict[str, float]:
    """Trains the model, evaluates it on the test split and saves the run.

    Args:
        config: Hyperparameters; see `configs/default.py`.
        workdir: Directory that receives the effective config, the
            TensorBoard log, the model file and the test metrics.

    Returns:
        Test metrics keyed by name: `loss` and `auc`.
    """
    keras.utils.set_random_seed(config.seed)
    os.makedirs(workdir, exist_ok=True)
    with open(os.path.join(workdir, 'config.json'), 'w') as f:
        json.dump(config.to_dict(), f, indent=2)

    train_x, train_y = load_split(os.path.join(config.data_dir, 'train.csv'))
    valid_x, valid_y = load_split(os.path.join(config.data_dir, 'valid.csv'))
    test_x, test_y = load_split(os.path.join(config.data_dir, 'test.csv'))

    model = build_model(
        numeric_values={name: train_x[name] for name in NUMERIC_FEATURES},
        vocabularies={
            name: sorted(set(train_x[name].ravel()))
            for name in CATEGORICAL_FEATURES
        },
        hidden_units=config.hidden_units,
        dropout=config.dropout,
    )
    model.compile(
        optimizer=keras.optimizers.Adam(config.learning_rate),
        loss='binary_crossentropy',
        metrics=[keras.metrics.AUC(name='auc')],
    )
    model.fit(
        train_x,
        train_y,
        validation_data=(valid_x, valid_y),
        batch_size=config.batch_size,
        epochs=config.max_epochs,
        callbacks=[
            keras.callbacks.EarlyStopping(
                monitor='val_auc',
                mode='max',
                patience=config.patience,
                restore_best_weights=True,
            ),
            keras.callbacks.TensorBoard(
                log_dir=os.path.join(workdir, 'tensorboard')
            ),
        ],
        verbose=0,
    )
    model.save(os.path.join(workdir, 'model.keras'))

    loss, auc = model.evaluate(
        test_x, test_y, batch_size=config.batch_size, verbose=0
    )
    metrics = {'loss': float(loss), 'auc': float(auc)}
    with open(os.path.join(workdir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)
    logging.info('Test AUC %.4f', metrics['auc'])
    return metrics
```

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Библиотека | CatBoost - библиотека Яндекса; категориальные признаки передаются как есть через `cat_features`, one-hot до модели не делают | Keras 3 (`import keras`) - библиотека Google; категориальные признаки кодирует слой `StringLookup`; правил о табличном бустинге у Google нет | [Y-LIB-001](../docs/ml/libraries.md) · [G-LIB-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/libraries.md), правила нет |
| Формат конфига | один файл данных на запуск: JSON (или TOML); имя `0.json` - номер сида | Python-файл `configs/default.py` с `get_config()`, возвращающей `ml_collections.ConfigDict`; поля переопределяются из командной строки | [Y-ML-009](../docs/ml/project-structure.md) · [G-ML-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Как скрипт получает конфиг | путь к файлу - единственный обязательный аргумент `argparse` | флаги absl `--config` (`DEFINE_config_file` с `lock_config=True`) и `--workdir`; объявлены только в `main.py`, библиотечный модуль флагов не читает | [Y-ML-009](../docs/ml/project-structure.md) · [G-ML-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md), [G-ML-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Где результат | каталог рядом с конфигом (`0/`), его создаёт скрипт; `report.json` и маркер `DONE`; готовый запуск не перезаписывается без `--force` | рабочий каталог из флага, вне дерева исходников: `config.json`, `tensorboard/`, `model.keras`, `metrics.json` | [Y-ML-010](../docs/ml/project-structure.md) · [G-ML-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md), [G-REPRO-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Что попадает в git | из `experiments/**` - только конфиги, `report.json` и `DONE` (белый список в `.gitignore`); данные и модель - нет | конфиги и код; данные и каталоги запусков - в `.gitignore` | [Y-ML-011](../docs/ml/project-structure.md), [Y-MLOPS-001](../docs/ml/mlops.md) · [G-MLOPS-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/mlops.md), [G-ML-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Сид | поле `seed` конфига → `random_seed` CatBoost | `config.seed` → `keras.utils.set_random_seed` в начале запуска; `PYTHONHASHSEED` задаётся до старта процесса | [Y-REPRO-001](../docs/ml/reproducibility.md), [Y-LIB-008](../docs/ml/libraries.md) · [G-REPRO-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Устройство и детерминизм | `task_type = "CPU"` и `border_count = 254` заданы явно, потому что значения по умолчанию зависят от устройства; `task_type` пишется в отчёт | побитового совпадения не ожидают; версии фреймворка и ускоритель записывают в запись об эксперименте; `enable_op_determinism` - только для отладки и тестов | [Y-REPRO-007](../docs/ml/reproducibility.md), [Y-LIB-008](../docs/ml/libraries.md) · [G-REPRO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Сколько учить | `iterations=5000` с запасом, `eval_set`, детектор `od_type="Iter"` с `od_wait`, `use_best_model=True`; `depth=6` и автоматический learning rate | `max_epochs` и `EarlyStopping` по `val_auc` с `restore_best_weights=True` - приём библиотеки; правила профиля об этом нет (о чекпойнтах - [G-REPRO-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md)) | [Y-LIB-004](../docs/ml/libraries.md), [Y-LIB-006](../docs/ml/libraries.md) · правила нет |
| Артефакт модели | `model.cbm` - основной формат; ONNX только без категориальных признаков | `model.keras` через `model.save`; `pickle` не используется | [Y-LIB-009](../docs/ml/libraries.md) · [G-LIB-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/libraries.md) |
| Кривые обучения | `train_dir` в каталоге запуска (`catboost_info/`, читается TensorBoard) | `keras.callbacks.TensorBoard` в `workdir/tensorboard` | [Y-REPRO-012](../docs/ml/reproducibility.md) · [G-REPRO-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Запись о запуске | `report.json`: полный конфиг, метрики train/val/test, хост, версия CatBoost, время, хеш коммита; отчёты лежат в git и заменяют трекер | действующий конфиг и метрики в `workdir`; запись об эксперименте - конфиг @ коммит, команда воспроизведения, число запусков - в трекере по Tuning Playbook | [Y-REPRO-011](../docs/ml/reproducibility.md) · [G-REPRO-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Раскладка | `scripts/train.py` - исполняемый, никем не импортируется; конфиги в `experiments/`; модули в `src/` | `configs/`, `main.py` только с флагами и `app.run`, логика в `train.py`, тест `train_test.py` рядом | [Y-ML-001](../docs/ml/project-structure.md) · [G-ML-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md), [G-ML-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Конфиг и библиотечный код | `train(config, …)` получает словарь целиком - правила нет | `build_model(hidden_units=…, dropout=…)` принимает явные аргументы; `ConfigDict` разворачивается только в `train_and_evaluate` | правила нет · [G-ML-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md), [G-LIB-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/libraries.md) |
| Схема данных | категории - строки, пропуск - явная категория `"unknown"`, столбец pandas `Categorical`; схема проверяется тестом до обучения (не показан) | `StringLookup` с OOV-токеном; формы и dtype описаны в docstring (`[num_rows, 1]`) | [Y-LIB-002](../docs/ml/libraries.md), [Y-LIB-003](../docs/ml/libraries.md), [Y-ML-015](../docs/ml/project-structure.md) · [G-ML-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Docstring | reST-поля; формат один на репозиторий, для ML-библиотек допустим Google-стиль (как в YaFSDP) | секции `Args:` и `Returns:` с формами и dtype | [Y-PY-021](../docs/languages/python.md), [Y-ML-013](../docs/ml/project-structure.md) · [G-PY-028](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-ML-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) |
| Точка входа и логи | `if __name__ == "__main__": main()`; `logging.getLogger(__name__)`, ленивые аргументы | `app.run(main)` под тем же условием; `absl.logging` с `%`-шаблоном | [Y-ML-006](../docs/ml/project-structure.md), [Y-PY-027](../docs/languages/python.md) · [G-PY-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-039](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Окружение | `pyproject.toml`, `uv.lock` и `.python-version` в git; `uv sync --locked` в CI | lock-файл с хешами на каждую версию Python у библиотек и пайплайнов; у каталога эксперимента `requirements.txt` с `==` | [Y-REPRO-008](../docs/ml/reproducibility.md) · [G-REPRO-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md), [G-REPRO-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |
| Тест воспроизводимости | короткий запуск с фиксированным сидом сравнивается с эталоном с допуском (как канонические данные в тестах CatBoost) | два коротких запуска с одним сидом дают метрики в пределах допуска | [Y-REPRO-016](../docs/ml/reproducibility.md) · [G-REPRO-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md) |

### Почему так

Разница в конфиге - это разница в том, что считается источником истины. В профиле Яндекса конфиг - файл данных, один на запуск, а результат ложится рядом с ним, и оба попадают в git: в tabm так закоммичено больше 21 тысячи `report.json` ([Y-ML-010](../docs/ml/project-structure.md), [Y-REPRO-011](../docs/ml/reproducibility.md)). Git здесь заменяет трекер экспериментов: MLflow не встречается ни в одном из 12 репозиториев выборки. В профиле Google конфиг - код: Python-функция, которую проверяют линтер и тайп-чекер, с переопределением полей из командной строки и блокировкой от опечаток ([G-ML-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md), [G-ML-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md)); результат уходит в рабочий каталог вне дерева исходников, а запись об эксперименте живёт в трекере. Интерпретация: раскладка `yandex-research` выросла из задачи опубликовать воспроизводимые эксперименты к статье - конфиги и отчёты должны лежать в репозитории, чтобы их мог повторить читатель; раскладка Flax выросла из задачи сделать примеры одинаковыми и импортируемыми в Colab, и принципы «Hidden Technical Debt» о конфигурации (небольшое изменение предыдущей, трудно ошибиться, легко сравнить) в ней читаются буквально.

Второе - откуда берутся правила о библиотеках. У Яндекса почти все ML-правила - это документация CatBoost: категориальные признаки как есть, число итераций по валидации с детектором переобучения, `cbm` как основной артефакт, недетерминированность GPU и разные значения по умолчанию на CPU и GPU ([Y-LIB-001](../docs/ml/libraries.md), [Y-LIB-004](../docs/ml/libraries.md), [Y-LIB-008](../docs/ml/libraries.md), [Y-LIB-009](../docs/ml/libraries.md)); общих правил о структуре ML-проекта у Яндекса публично нет - [project-structure.md](../docs/ml/project-structure.md) прямо так и начинается. У Google слоёв больше: принципы (Rules of ML, «Hidden Technical Debt», ML Test Score), документация фреймворков (сериализация Keras, детерминизм TensorFlow) и практика примеров Flax; отсюда правила вроде «библиотечный код не знает о конфиге» ([G-ML-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md)) и «флаги только в точке входа» ([G-ML-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md)), которым в версии Google подчинены `build_model` и `main.py`. При этом оба профиля честно помечают почти все ML-правила как SHOULD и реконструкцию: ни одна из компаний не публикует стандарт ML-кода.

Третье - общее. Оба скрипта берут сид из конфига, выбирают число итераций по валидационному набору, пишут TensorBoard-совместимый лог в каталог запуска, сохраняют модель в формат библиотеки, а не pickle, и фиксируют хеш коммита или действующий конфиг; оба профиля требуют тест воспроизводимости с допуском, а не побитовое равенство ([Y-REPRO-006](../docs/ml/reproducibility.md), [G-REPRO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/reproducibility.md)). Сравнение ML-подходов целиком - пайплайны, реестры, карточки моделей - в [ml.md](ml.md).

## 6. README репозитория

**Задача.** Файл `README.md` для библиотеки `ratelimit` из второй пары - то, что читатель видит первым на GitHub. Оба профиля дают готовый шаблон ([Яндекс](../templates/repo/README.md), [Google](https://github.com/k1sur1n/google-codestyle/blob/main/templates/repo/README.md)); ниже они заполнены для одного и того же проекта. Пара выбрана потому, что оба профиля формулируют требование к README одинаково - «ответить на пять вопросов» - а сами вопросы разные. Текст английский: у Яндекса README написан по-английски во всех 25 измеренных репозиториях ([Y-REPO-001](../docs/git/repository.md)), гайды Google написаны для английского текста ([G-DOC-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)).

### Версия Яндекса

````markdown
# ratelimit

[![CI](https://img.shields.io/github/actions/workflow/status/example-org/ratelimit/.github/workflows/lint.yml?branch=main&label=CI&logo=github)](https://github.com/example-org/ratelimit/actions/workflows/lint.yml?query=branch:main)

[English](README.md) | [Русский](README.ru.md)

ratelimit is a small Python library for rate limiting and retrying calls to flaky backends.

## About

ratelimit gives services a single, tested implementation of two patterns that every client
re-invents: a token bucket that caps the request rate and a retry policy with exponential backoff.

- Token bucket with a pluggable clock, so tests never sleep
- Retry policy with exponential backoff and optional jitter
- Fully typed; ships `py.typed`

## Getting Started

### Prerequisites

Python 3.10 or newer. Linux, macOS and Windows are supported.

### Installation

```shell
pip install ratelimit
```

## Usage

```python
from ratelimit.retry import RetryPolicy, run_with_retry

policy = RetryPolicy(max_attempts=5, base_delay=0.2, jitter=True)
rows = run_with_retry(fetch_rows, policy, retry_on=(ConnectionError,))
```

See the [documentation](https://example-org.github.io/ratelimit/) for guides and reference.

## How to Build from Source Code

```shell
git clone https://github.com/example-org/ratelimit.git
cd ratelimit
uv sync --locked
uv run pytest
```

## How to Contribute

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
To report a security issue, follow [SECURITY.md](SECURITY.md).

## License

ratelimit is distributed under the Apache-2.0 license. See [LICENSE](LICENSE) for details.
````

### Версия Google

````markdown
# ratelimit

ratelimit is a small Python library that caps the request rate to a backend
and retries failed calls with exponential backoff.

> **Status:** actively maintained. Support is provided on a best-effort basis
> through the issue tracker.

## Get started

Prerequisites: Python 3.12 or newer.

```sh
pip install ratelimit
python -m ratelimit.examples.retry_demo
```

## Use ratelimit

```python
from ratelimit import retry

policy = retry.RetryPolicy(max_attempts=5, base_delay=0.2, jitter=True)
rows = retry.run_with_retry(fetch_rows, policy, retry_on=(ConnectionError,))
```

## Documentation

- [User guide](docs/guide.md)
- [How to run the tests](docs/testing.md)
- [How to release](docs/releasing.md)

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). All changes, including changes by
project members, go through code review.

## Report a security issue

Follow [SECURITY.md](SECURITY.md). Don't open a public issue for a
vulnerability.

## Contact

- Maintainers: the ratelimit team (see [AUTHORS](AUTHORS))
- Questions and discussion: https://github.com/example-org/ratelimit/issues

## License

ratelimit is licensed under the Apache License, Version 2.0. See
[LICENSE](LICENSE). Code under `third_party/` keeps its original licenses.
````

### Что отличается

| Что отличается | Яндекс | Google | Правила |
|---|---|---|---|
| Пять вопросов README | что это, как установить или запустить, как собрать из исходников, как внести вклад, под какой лицензией | что это и зачем, к кому обращаться, каков статус, как пользоваться, где документация | [Y-DOC-009](../docs/git/repository.md) · [G-DOC-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Статус поддержки | раздела нет (правила нет) | блок «Status» обязателен по смыслу: у Google - дисклеймер «not an officially supported Google product», в чужом проекте - честная фраза о поддержке | правила нет · [G-REPO-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Контакты | вопросы - через `CONTRIBUTING.md` | раздел «Contact»: мейнтейнеры (файл `AUTHORS` при копирайте «The [Project] Authors») и место для вопросов | [Y-REPO-006](../docs/git/repository.md) · [G-DOC-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Сборка из исходников | отдельный раздел «How to Build from Source Code» - так у YDB и YTsaurus | раздела нет: тесты и релиз описаны в `docs/`, README даёт ссылки | [Y-DOC-009](../docs/git/repository.md) · [G-DOC-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Бейджи и вторая языковая версия | бейдж CI (15 из 25 репозиториев) и ссылка на `README.ru.md` (4 из 25) - необязательные элементы шаблона | ни бейджей, ни второй версии шаблон не предусматривает (правила нет) | [Y-DOC-009](../docs/git/repository.md) (статистика «README (из 25)») · правила нет |
| Заголовки | в стиле title case: «Getting Started», «How to Build from Source Code» - как в README продуктов Яндекса | sentence case: «Get started», «Use ratelimit», «Report a security issue» | [Y-DOC-009](../docs/git/repository.md) (форма - из образцов) · [G-DOC-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Длина строки | не ограничена (Prettier с `tabWidth: 2` для `*.md` прозу не переносит) - самая длинная строка 231 символ (бейдж) | прозаические строки до 80 символов, исключения - ссылки, таблицы, заголовки, код | [Y-TS-001](../docs/languages/other.md) (настройка Prettier для `*.md`) · [G-DOC-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Блоки кода | огороженные, язык указан (`shell`, `python`) | то же (`sh`, `python`); правило записано явно | правила нет · [G-DOC-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Ссылки внутри репозитория | относительные | относительные от корня, без `../`; текст ссылки называет цель | [Y-DOC-004](../docs/git/repository.md) (для документации Diplodoc) · [G-DOC-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Ревью | в README не упоминается (правила нет; сам PR с одобрением обязателен - [Y-BR-003](../docs/git/branches.md), [Y-REPO-017](../docs/git/repository.md)) | фраза «All changes, including changes by project members, go through code review» - из `google/new-project` | правила нет · [G-REPO-021](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Лицензия | один файл `LICENSE`; части под другой лицензией перечисляются в README (так у Perforator) | Apache-2.0 по умолчанию; упомянут `third_party/` с исходными лицензиями чужого кода | [Y-REPO-002](../docs/git/repository.md), [Y-REPO-003](../docs/git/repository.md) · [G-REPO-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-REPO-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |
| Пример использования | `from ratelimit.retry import RetryPolicy, run_with_retry` | `from ratelimit import retry` - то же правило импорта модулей, что в коде | правила нет · [G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) |
| Откуда шаблон | реконструкция по README ydb, ytsaurus, perforator и uikit | docguide «READMEs» и документация OSPO «Preparing for release» | [Y-DOC-009](../docs/git/repository.md) · [G-DOC-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md), [G-DOC-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md) |

### Почему так

Пять вопросов README разные, потому что разные читатели. Список Яндекса - реконструкция по README продуктов (YDB, YTsaurus) и библиотек (uikit): «что это → установить → собрать из исходников → внести вклад → лицензия» - это маршрут человека, который собирается запустить продукт или прислать патч ([Y-DOC-009](../docs/git/repository.md); источник - практика, уверенность средняя). Список Google записан в docguide и адресован прежде всего коллеге внутри компании, который наткнулся на каталог в монорепозитории: «что это и зачем → к кому обращаться → каков статус → как пользоваться → где документация» ([G-DOC-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)). Интерпретация: отсюда раздел «Contact» и блок статуса у Google и раздел о сборке из исходников у Яндекса - у первого README служит точкой входа в чужой код, у второго - витриной открытого продукта.

Блок статуса - единственное место, где правило Google нельзя перенести буквально: фраза «This is not an officially supported Google product» обязательна для неофициальных проектов Google ([G-REPO-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/repository.md)), но в чужом репозитории была бы неправдой, поэтому профиль сохраняет цель правила - честно задать ожидания от поддержки - и меняет текст. У Яндекса такого правила нет: статус проекта в README его репозиториев не декларируется. Остальные различия - форма: Google задаёт правила разметки (80 символов, sentence case, язык у блоков кода, ссылки без `../`) письменно в docguide; Яндекс о разметке README не пишет ничего, и в примере она следует только Prettier с настройками Gravity UI.

## Что проверено инструментами

Все проверки выполнены 2026-10-16 в среде сборки на опубликованных выше текстах; рабочие файлы лежат вне репозитория. Версии: clang-format 18.1.3, clang-tidy 18.1.3, g++ 13.3.0, clang++ 18.1.3, Python 3.13.16, ruff 0.16.8, black 26.5.1, mypy 2.3.1, pyright 1.1.414, pytest 9.1.1, Node.js 22, Prettier 3.8.1, TypeScript 6.0.2.

| Пара | Яндекс | Google | Что не запускалось |
|---|---|---|---|
| 1. C++ | `clang-format --style=file --dry-run --Werror` с [`.clang-format`](../configs/cpp/.clang-format) профиля - 0 замечаний (текст совпадает с выводом форматтера); `g++` и `clang++ -std=c++20 -Wall -Wextra -fsyntax-only`; `clang-tidy` с [`.clang-tidy`](../configs/cpp/.clang-tidy) профиля и `-header-filter` на каталог примера - 0 предупреждений | то же с [`.clang-format`](https://github.com/k1sur1n/google-codestyle/blob/main/configs/cpp/.clang-format) и [`.clang-tidy`](https://github.com/k1sur1n/google-codestyle/blob/main/configs/cpp/.clang-tidy) профиля; компиляция с `-fno-exceptions -Wold-style-cast -Wimplicit-fallthrough -Wswitch`, дополнительно `clang++` с `-Wctad-maybe-unsupported -Wreorder-init-list -Wdeprecated-this-capture -Wvla -Wexit-time-destructors -Wglobal-constructors` - 0 предупреждений; clang-tidy - 0 предупреждений | Abseil и GoogleTest не установлены: вместо них минимальные заглушки `absl/status/status.h`, `absl/status/statusor.h`, `absl/strings/str_cat.h`, `gtest/gtest.h` в scratch-каталоге; тесты не собирались и не запускались. Контроль: намеренно испорченные имена (`tokens`, `getAvailable`, `TokenBucketOptions` без `T`, `Tokens` без `_`) оба конфига clang-tidy находят |
| 2. Python | `python3 -m py_compile`; `ruff format --check` и `ruff check` с [`pyproject.toml`](../configs/python/pyproject.toml) профиля - чисто; `mypy` (с интерпретатором, где установлен pytest) и `pyright` - 0 ошибок; `pytest` - 2 теста прошли | `ruff check` с [`pyproject.toml`](https://github.com/k1sur1n/google-codestyle/blob/main/configs/python/pyproject.toml) профиля (основной набор) - чисто; `ruff check --select I` с секцией `[tool.ruff.lint.isort]` конфига - порядок импортов принят; `ruff format --check` с настройками варианта B и `black 26.5.1 -l 80 --skip-string-normalization` - файлы не меняются; `mypy`, `pyright` - 0 ошибок; `pytest` - 3 теста прошли | pyink, isort и pylint не установлены (реестр пакетов недоступен): формат Google проверен приближённо через `ruff format` и black (pyink - форк Black той же версии), порядок импортов - через настройки isort в ruff |
| 3. Компонент | `prettier --check` с [`.prettierrc.json`](../configs/web/.prettierrc.json) профиля для `.tsx`, `.ts`, `.scss`, `.json` - чисто; `tsc 6.0.2 --noEmit --strict --jsx react-jsx` - ошибки только об отсутствующих пакетах React и Gravity UI; JSON i18n разобран `json.load` | `prettier --check` с [`.prettierrc.json`](https://github.com/k1sur1n/google-codestyle/blob/main/configs/web/.prettierrc.json) профиля для `.ts`, `.html` (парсер `angular`), `.css` - чисто; `tsc --noEmit --strict` - ошибка только об отсутствующем `@angular/core` | ESLint с плагинами Gravity UI, angular-eslint и Stylelint не установлены - правила `react/*`, `jsx-a11y/*`, `@angular-eslint/*`, `order/*` не исполнялись; код не собирался и не рендерился |
| 4. Коммит и PR | shell-хук `commit-msg` из [commits.md](../docs/git/commits.md) профиля: сообщение Яндекса принято, сообщение Google отклонено (нет типа); `prettier --check` для текста PR | правила `commitlint.config.mjs` из [commits.md](https://github.com/k1sur1n/google-codestyle/blob/main/docs/git/commits.md) профиля воспроизведены скриптом на Python (`header-max-length`, `header-min-length`, `header-case`, `header-full-stop`, `header-trim`, `body-leading-blank`, `body-max-line-length`): сообщение Google принято, на сообщении Яндекса сработало `header-case`; `prettier --check` для текста PR | сам commitlint не установлен; длина строк посчитана `awk` (заголовки 47 и 34 символа, строки тела до 70) |
| 5. ML | `py_compile`; `ruff format --check`, `ruff check` с конфигом профиля - чисто; `mypy --ignore-missing-imports`, `pyright` - ошибки только об отсутствующем `catboost`; JSON-конфиг разобран | `py_compile`; `ruff check`, `ruff check --select I`, `ruff format --check`, `black -l 80 --skip-string-normalization` - чисто; `mypy --ignore-missing-imports` - 0 ошибок; `pyright` - ошибки только об отсутствующих `keras` и `ml_collections` (`absl-py` 2.5.0, `pandas` 3.0.5 и `numpy` 2.5.3 установлены и разрешились) | CatBoost, Keras и ml_collections не установлены: обучение, запись `report.json`, сохранение `model.cbm` и `model.keras` - **не запускалось**; корректность вызовов API сверена с правилами профилей, не с библиотеками |
| 6. README | `prettier --check` с `.prettierrc.json` профиля (для `*.md` - `tabWidth: 2`) - чисто | `prettier --check` с `.prettierrc.json` профиля - чисто; длина всех строк ≤ 80 проверена `awk` | markdownlint не установлен: правила `MD013`, `MD040`, `MD025` не исполнялись |

Что проверить нельзя было в принципе: правила уровня «ручное ревью» (их в профилях большинство - например, [Y-CPP-012](../docs/languages/cpp.md) о порядке секций класса, [G-CPP-026](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [Y-REACT-019](../docs/frameworks/react.md) об i18n, [G-ML-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/ml/project-structure.md) о конфиге в библиотечном коде). Соответствие кода этим правилам - утверждение авторов сравнения, прослеживаемое по таблицам выше, а не результат инструмента.
