# JS 运行时调研：Bun 与 MicroQuickJS

## 背景
在 Docker/容器环境下使用 JavaScript 运行时，需要了解它们的架构、控制方式，以及对文件系统和宿主环境依赖的限制。下文总结了 Bun 与 MicroQuickJS（MQuickJS）的关键特性，并讨论 Claude Code（或其他生成的 JS/TS 代码）在这些运行时中的可行性。

## Bun
- 定位与架构：Bun 是单一可执行文件，旨在成为 Node.js 的直接替代，基于 JavaScriptCore 与 Zig，提供运行时、包管理器、测试等一体化工具。【F:js-runtime/bun_readme.md†L27-L41】
- 控制方式（常用命令）：运行脚本 `bun run`, 安装/执行包 `bun install`、`bunx <pkg>`，运行测试 `bun test`，均通过同一 `bun` CLI 完成。【F:js-runtime/bun_readme.md†L31-L41】
- 支持平台：Linux/macOS/Windows，官方提供二进制与 Docker 镜像，适合容器化场景。【F:js-runtime/bun_readme.md†L46-L69】
- 运行时能力与资源访问：内置大量 API（HTTP、WebSocket、Worker、文件 I/O、SQLite/Redis/PostgreSQL 客户端、TCP/UDP、spawn/子进程、FFI/C 编译器等），可直接访问宿主文件系统和网络，不默认沙箱化。【F:js-runtime/bun_readme.md†L171-L204】
- 配置与环境：支持环境变量、模块解析、插件、watch 模式、单文件可执行打包等，配置集中在 `bunfig.toml` 等运行时选项。【F:js-runtime/bun_readme.md†L102-L119】
- Python/其他依赖：Bun 自身为独立二进制，不依赖 Python；仅当使用 Node-API 原生扩展或外部构建链时才可能需要系统工具链。可通过 `bun spawn`/`$` Shell 调用宿主 Python，但这取决于容器中是否安装 Python。
- Claude Code 兼容性：Claude 生成的现代 JS/TS 与大多数 Node API 基本可直接在 Bun 上运行；若依赖尚未实现的 Node 边角 API 或特定 C/C++ 原生模块，则需验证兼容性并按需开启 Node-API 支持。

## MicroQuickJS (MQuickJS)
- 定位：面向嵌入式的精简 JS 引擎，10 KB 级 RAM、约 100 KB ROM 即可运行，性能接近 QuickJS，但只支持接近 ES5 的子集并启用更严格模式。【F:js-runtime/microquickjs_readme.md†L6-L20】
- 交互与控制：提供 `mqjs` REPL/命令行，可指定 `--memory-limit` 控制内存，`-o` 输出字节码到文件/ROM，`-m32` 生成适合 32 位系统的字节码；字节码可在目标设备上直接运行。【F:js-runtime/microquickjs_readme.md†L23-L64】【F:js-runtime/microquickjs_readme.md†L45-L64】
- 语言特性限制：只支持严格模式、无数组空洞、仅全局 `eval`、不支持装箱对象；字符串/正则/Date 功能被压缩，整体语法接近 ES5，现代 Node/Web API 不可用。【F:js-runtime/microquickjs_readme.md†L66-L120】【F:js-runtime/microquickjs_readme.md†L150-L189】
- 文件系统/环境依赖：引擎自带内存分配器，创建上下文需预分配内存缓冲，不依赖 `malloc/free/printf` 等 C 库调用，标准库可编译为常驻 ROM，适用于无操作系统或精简 RTOS 环境。【F:js-runtime/microquickjs_readme.md†L193-L208】【F:js-runtime/microquickjs_readme.md†L260-L280】
- 与宿主集成：需在宿主固件中通过 C API 暴露文件/IO 等能力；默认不提供 Node 式文件系统或网络 API，因此容器内若直接使用可执行文件，仅适合运行纯计算/算法脚本。
- Claude Code 兼容性：受限于 ES5 子集和缺失的 Node/Web API，Claude 生成的现代 JS/TS 代码通常需要大幅降级和去依赖；适合体积受限的嵌入式脚本，不适合直接运行常规后端/工具链代码。

## 在容器/虚拟机中的实践建议
1. **Bun**：
   - 直接使用官方 Docker 镜像或在容器内安装单一二进制即可；通过卷挂载共享代码、使用 `bun run|test|install` 管理生命周期。
   - 若需要调用 Python，可在容器中安装并用 `bun spawn` 执行；注意原生扩展编译可能需要构建工具链。
2. **MicroQuickJS**：
   - 更适合作为嵌入式交叉编译目标。在容器中可编译 `mqjs` 可执行文件做模拟测试，但实际部署仍需在目标固件中嵌入并暴露所需外设 API。
   - 运行 Claude 生成的脚本前需确保代码符合 ES5 子集并不依赖宿主 FS/网络；必要时通过 C API 手工桥接。
