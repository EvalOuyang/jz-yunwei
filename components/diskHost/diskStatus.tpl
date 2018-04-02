<h2>磁盘状态</h2>
<div  class="diskInfo">
    <div class="chart">
        <h3>总共（块）<span>{{total}}</span></h3>
        <ul>
        {{#each statusList}}
            <li class="{{type}}"></li>
        {{/each}}
        </ul>
    </div>
    <div class="share">
        <ul>
            {{#each status}}
            <li class="id{{addOne @index}}">
                <div class="name">{{name}}</div>
                <div><div class="value">{{value}}</div><div class="percent">{{percent}}</div></div>
            </li>
            {{/each}}
        </ul>
    </div>
</div>