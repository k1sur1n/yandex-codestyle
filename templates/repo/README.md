<!--
Шаблон README.md - профиль Яндекса (реконструкция, см. docs/git/repository.md: Y-REPO-001, Y-DOC-009).
Структура собрана по README ydb-platform/ydb, ytsaurus/ytsaurus, yandex/perforator и gravity-ui/uikit.
Язык - английский: так написаны README всех 25 измеренных репозиториев.
Замените <PROJECT>, <OWNER>, <REPO> и остальные метки в угловых скобках, затем удалите этот комментарий.
-->

# <PROJECT>

<!-- Бейджи есть у 15 из 25 репозиториев. Строка ниже повторяет бейдж CI из README gravity-ui/uikit; удалите, если не нужна. -->
[![CI](https://img.shields.io/github/actions/workflow/status/<OWNER>/<REPO>/.github/workflows/<WORKFLOW>.yml?branch=main&label=CI&logo=github)](https://github.com/<OWNER>/<REPO>/actions/workflows/<WORKFLOW>.yml?query=branch:main)

<!-- Если есть русская версия, держите её в отдельном файле (4 из 25) и оставьте эту строку. -->
[English](README.md) | [Русский](README.ru.md)

<One or two sentences: what <PROJECT> is and who it is for.>

## About

<What problem the project solves and its main features, as a short list.>

- <Feature or advantage 1>
- <Feature or advantage 2>

## Getting Started

### Prerequisites

<Supported platforms and minimal requirements: OS, language or runtime version, hardware if relevant.>

### Installation

```shell
<install command>
```

## Usage

```<language>
<minimal working example>
```

See the [documentation](<DOCS_URL>) for guides and reference.

## How to Build from Source Code

```shell
git clone https://github.com/<OWNER>/<REPO>.git
cd <REPO>
<build command>
<test command>
```

## How to Contribute

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
To report a security issue, follow [SECURITY.md](SECURITY.md).

## License

<PROJECT> is distributed under the <LICENSE_NAME> license. See [LICENSE](LICENSE) for details.
<!-- Если часть кода распространяется под другой лицензией, перечислите её здесь с путём (так сделано в yandex/perforator):
- `<path/to/component>` - <OTHER_LICENSE>, see [`<path/to/component>/LICENSE`](<path/to/component>/LICENSE).
-->
