/*
 * @packet base; 
 * @template template.temp;
 * @css style.test;
 */
Module({
    name:"test",
    extend:"view",
    template:module.getTemplate("@temp","test"),
    init:function(){
        this.render();
    }
});