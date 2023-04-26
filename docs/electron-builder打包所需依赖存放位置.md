
使用 electron-builder 打包的时候会自动下载所需的依赖，但是下载过程可能因某些神秘力量而失败。因此需要手动下载，再将工具放于指定路径：

- mac
``` bash
$ ~/Library/Caches/electron
$ ~/Library/Caches/electron-builder
$ ~/Library/Application Support/Caches
```
- linux
``` bash
$ ~/.cache/electron-builder
```
- windows

``` bash
$ %LOCALAPPDATA%\electron\cache
$ %LOCALAPPDATA%\electron-builder\cache
```