<h4>各支队故障</h4>
<div class="content">
    <div class="tab_box">
        <div  class="tab">
            <div style="display:block;" class="box">
                <ul>
                    {{#each page1}}
                    <li>
                        <div class="title">{{name}}</div>
                        <div class="total">{{value}}</div>
                        <div class="totalText">条故障</div>
                        <div class="chart">
                            <div class="noDeal">{{unTreated}}</div>
                            <div class="bar">
                                <div class="noDealBar" style="height:{{unTreatedLen}}px"></div>
                                <div class="arDealBar" style="height:{{alreadyLen}}px"></div>
                            </div>
                            <div class="arDeal">{{already}}</div>
                        </div>
                    </li>
                     {{/each}}
                </ul>
            </div>

        </div>
    </div>
    <ul class="Legend">
       <li>
            <div class="noDealBar"></div>
            <div>未处理</div>
        </li>
        <li>
            <div class="arDealBar"></div>
            <div>已处理</div>
        </li>
    </ul>
</div>