<ul class="routes-ul">
    {{#each this}}
        <li class="route-item">
            <div class="{{className}}">{{name}}</div>
            <div class="route-bar">
                <div class="bar-item">
                    <div class="flow" style="width:{{width1}}px"></div><div class="label">{{flow}}</div>
                </div>
                <div class="bar-item">
                    <div class="band-width" style="width:{{width2}}px"></div><div class="label">{{bandWidth}}</div>
                </div>

            </div>
        </li>
    {{/each}}
</ul>