 {{#each this}}
<li data-id="{{id}}">
    <p class="percent">{{percent}}</p>
    <p class="guzhang-total">{{value}}</p>
    <p class="notRepair"><span class="title">故&nbsp;&nbsp;障</span><span class="value">{{notRepair}}</span></p>
    <p class="willAlarm"><span class="title">即将损坏</span><span class="value">{{willAlarm}}</span></p>
</li>
{{/each}}