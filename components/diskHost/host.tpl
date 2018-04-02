{{#each this}}
<li>
    {{#each list}}
    <div class="text">
    	<div class="name">{{name}}</div>
    	<div class="value">{{value}}</div>
    </div>
    {{/each}}
    <div class="deviceInfo">
        <div class="hostIp">{{ip}}</div>
        <div class="hostName">{{name}}</div>
    </div>
</li>
{{/each}}
