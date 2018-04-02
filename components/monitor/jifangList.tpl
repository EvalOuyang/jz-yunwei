
    <div class="jifang-selection">{{defaultRoom}}</div>
    <ul class="jifang-dropdown">
        {{#each data}}
            <li data-temperature={{temperature}} data-humidity={{humidity}} data-voltage={{voltage}} data-electric={{electric}}>{{name}}</li>
        {{/each}}
    </ul>
