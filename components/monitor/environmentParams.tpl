
    {{#each this}}
        <div>
            <div class="param-icon" style="background:{{iconUrl}}"></div>
            <div class="param-title">{{name}}</div>
            <div class="param-value" style="color:{{textColor}}">{{value}}{{unit}}</div>
        </div>
    {{/each}}