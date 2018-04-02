<div class="monitor-list-container">
    <div class="monitor-list">
        <div class="title">{{this.name}}</div>
        <div class="monitor">
            <div class="table-head">
                <div>主机名称</div>
                <div>IP地址</div>
                <div>CPU占比(%)</div>
            </div>
            <div class="table-container">
                <table>
                    {{#each this.list}}
                        <tr>
                            <td>{{name}}</td>
                            <td>{{ip}}</td>
                            <td>{{CPU}}</td>
                        </tr>            
                    {{/each}}
                </table>
            </div>
        </div>
        <div class="close-monitor"></div>
    <div>
<div>