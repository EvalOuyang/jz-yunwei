{{#each this}}
<li>
    {{#each list}}
    <div class="text">
    	<div class="name">{{name}}</div>
    	<div class="value">{{value}}</div>
    </div>
    {{/each}}
    <div class="netName">
        <div>{{ip}}</div>
        <div>{{name}}</div>
    </div>
</li>
{{/each}}
