var corgiserver = require("corgiserver");
var builder = require("brightbuilder");
require("./bright");
module.exports = {
    create: function () {
        var projectPath = process.cwd(), resourcePath = __dirname + "/res", buildPath = resourcePath + "/webapp/src/build.json", projectName = projectPath.split("/").pop();
        bright.file(buildPath).read().then(function (a) {
            var t = JSON.parse(a);
            t.id = projectName;
            return bright.file(buildPath).write(JSON.stringify(t, null, 3));
        }).then(function () {
            var ps = bright.promise(), queue = bright.queue();
            queue.complete(function () {
                ps.resolve();
            });
            bright.file(resourcePath).scan(function (a) {
                bright.file(projectPath + a.substring(resourcePath.length)).make();
                queue.add(function () {
                    bright.file(a).copy(projectPath + a.substring(resourcePath.length)).done(function () {
                        queue.next();
                    }).fail(function () {
                        queue.next();
                    });
                });
            });
            queue.run();
            return ps;
        }).done(function () {
            corgiserver.create(projectName, projectPath);
        });
    },
    build: function () {
        builder.build(process.cwd() + "/webapp/src");
    },
    run: function () {
        corgiserver.run();
    }
};