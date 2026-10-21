// Профиль «Яндекс» · веб (React + TypeScript) · ESLint, flat config.
// Данные актуальны на 2026-10-09. Правила описаны в docs/frameworks/react.md (Y-REACT-*, Y-CSS-*)
// и в docs/languages/other.md (Y-TS-*).
//
// Основа: @gravity-ui/eslint-config 4.3.2 (2026-06-30, MIT) в том составе и порядке, в каком его
// подключает gravity-ui/uikit (eslint.config.mjs, коммит a2f7a1d, 2026-10-07, MIT), плюс возврат
// правила curly, как в ydb-platform/ydb-embedded-ui (eslint.config.mjs, коммит a2659a0, Apache-2.0).
// Это реконструкция по открытым репозиториям: единого стандарта компании Яндекс не публикует.
//
// Версии (диапазоны eslint, prettier, typescript и Node.js - как в package.json gravity-ui/uikit
// на коммите a2f7a1d; диапазон @gravity-ui/eslint-config - закрепление профиля на последнем релизе 4.x):
//   eslint                     ^9.38.0 - нужен мажор 9, НЕ 10: конфиг собран под ESLint 9
//                                         (@eslint/js ^9.23.0), а его зависимости
//                                         eslint-plugin-import 2.32.0 и eslint-plugin-react 7.37.5
//                                         объявляют peer eslint только до ^9.
//   @gravity-ui/eslint-config  ^4.3.2 - в uikit записано ^4.2.0 (разрешается в 4.3.2, другого
//                                         релиза 4.x после него нет); только ESM ("type": "module")
//                                         и только flat config.
//   prettier                   ^3.5.3 - peer ^3.0.0; опции берутся из .prettierrc.json.
//   typescript                 ^5.9.3 - peer >=4.8.4 <6.1.0; TypeScript 7.x не подходит.
//   Node.js                    >= 20.19 (engines в package.json uikit)
// Плагины отдельно ставить не нужно - это dependencies пакета @gravity-ui/eslint-config 4.3.2:
//   eslint-plugin-react ^7.37.5, eslint-plugin-react-hooks ^5.2.0, eslint-plugin-import ^2.32.0,
//   eslint-plugin-jsx-a11y ^6.10.2, eslint-plugin-prettier ^5.2.6, eslint-config-prettier ^10.1.2,
//   @typescript-eslint/parser и @typescript-eslint/eslint-plugin ^8.57.0.
//
// Файл - ES-модуль: в package.json нужен "type": "module", иначе переименуйте файл
// в eslint.config.mjs (так сделано в gravity-ui/uikit).
//
// Проверено локально: синтаксис - node --check (Node.js 22.22.0); загрузка файла и схема конфига - 
//   ESLint 10.1.0 с заглушками вместо пакетов @gravity-ui/eslint-config/* (заглушки объявляют
//   плагины react, import, @typescript-eslint с пустыми правилами): на тестовых .js-файлах с JSX
//   сработали встроенные правила curly, no-console и селектор импорта React из no-restricted-syntax,
//   блок для __stories__ отключил no-console, каталог build пропущен.
// Не запускалось: реестр пакетов недоступен из среды сборки, поэтому настоящие
//   @gravity-ui/eslint-config 4.3.2 и ESLint 9.x не устанавливались; правила плагинов (react/*,
//   import/*, @typescript-eslint/*) и селектор React.FC (нужен парсер TypeScript) сверены по именам
//   и опциям с конфигом uikit, но не исполнялись.

import baseConfig from '@gravity-ui/eslint-config'; // base + typescript
import a11yConfig from '@gravity-ui/eslint-config/a11y'; // eslint-plugin-jsx-a11y, recommended
import clientConfig from '@gravity-ui/eslint-config/client'; // react + react-hooks + глобалы браузера
import importOrderConfig from '@gravity-ui/eslint-config/import-order'; // import/order
import prettierConfig from '@gravity-ui/eslint-config/prettier'; // eslint-plugin-prettier/recommended

export default [
    ...baseConfig,
    ...clientConfig, // Y-REACT-008, Y-REACT-009
    ...prettierConfig, // Y-REACT-012 и форматирование из .prettierrc.json
    ...importOrderConfig,
    ...a11yConfig, // Y-REACT-013
    {
        rules: {
            // eslint-config-prettier (внутри prettierConfig) выключает curly, хотя в base.js оно
            // ERROR: gravity-ui/eslint-config#44. Возвращаем явно, как ydb-embedded-ui (Y-TS-003).
            curly: ['error', 'all'],

            // Y-REACT-011: <React.Fragment>, а не <>.
            'react/jsx-fragments': ['error', 'element'],
            // Новый JSX-рантайм ("jsx": "react-jsx"): React в области видимости JSX не обязателен.
            'react/react-in-jsx-scope': 'off',

            'no-restricted-syntax': [
                'error',
                // Y-REACT-005: один стиль импорта React на репозиторий. Здесь вариант uikit,
                // page-constructor и components. Вариант date-components и ydb-embedded-ui обратный
                // (import React from 'react') - тогда замените этот элемент их селектором.
                {
                    selector:
                        "ImportDeclaration[source.value='react'] :matches(ImportDefaultSpecifier, ImportSpecifier)",
                    message: "Please use `import * as React from 'react'` instead.",
                },
                // Y-REACT-001: без React.FC.
                {
                    selector: "TSTypeReference>TSQualifiedName[left.name='React'][right.name='FC']",
                    message: "Don't use React.FC",
                },
            ],

            // import type {…} отдельной инструкцией, а не import {type …}.
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {prefer: 'type-imports', fixStyle: 'separate-type-imports'},
            ],
        },
    },
    {
        // В историях Storybook console разрешён (Y-REACT-018).
        files: ['**/__stories__/**/*.[jt]s?(x)'],
        rules: {'no-console': 'off'},
    },
    {
        ignores: ['build', 'dist', 'storybook-static'],
    },
];
