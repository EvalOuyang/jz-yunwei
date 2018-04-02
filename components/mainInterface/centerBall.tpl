<div class="monitor-list-container">
    <div class="monitor-list">
        <div class="title">{{this.name}}</div>
        <div class="monitor">
            <div class="table-head">
                <div>支队名称</div>
                <div>{{this.name}}</div>
            </div>
            <div class="table-container">
                <table>
                    {{#each this.list}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{value}}</td>
                            <td></td>
                        </tr>            
                    {{/each}}
                </table>
            </div>
        </div>
        <div class="close-monitor"></div>
    <div>
<div>