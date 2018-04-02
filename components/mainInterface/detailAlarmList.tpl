<div class="monitor-list-container">
    <div class="detailList">
        <div class="title">{{this.name}}</div>
        <div class="alarmDetail">
            
            {{#each this.list}}
                <div class="list-item">
                    <div class="time-ip">{{alarmTime}}&nbsp;&nbsp;{{ip}}</div>
                    <div class="content">{{alarmContext}}</div>
                </div>
            {{/each}}
            
        </div>
        <div class="close-monitor"></div>
    <div>
<div>