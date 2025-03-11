# Markdown 表单组件用法示例

## 基本表单元素

### 文本输入框 (Text Input) 
<label for="username">用户名:</label>
<input type="text" name="username" placeholder="请输入用户名" />

### 密码输入框 (Password Input)
<label for="password">密码:</label>
<input type="password" name="password" placeholder="请输入密码" />

### 电子邮箱输入框 (Email Input)
<label for="email">邮箱:</label>
<input type="email" name="email" placeholder="example@domain.com" />

### 数字输入框 (Number Input)
<label for="age">年龄:</label>
<input type="number" name="age" placeholder="请输入年龄" />

### 多行文本框 (Textarea)
<label for="description">描述信息:</label>
<textarea name="description" placeholder="请输入详细描述"></textarea>

### 下拉选择框 (Select)
<label for="country">国家/地区:</label>
<select name="country">
<option value="china">中国</option>
<option value="usa">美国</option>
<option value="japan">日本</option>
<option value="uk">英国</option>
</select>

## 新增表单元素

### 可编辑列表 (Editable List)
<!-- 普通可编辑列表 -->
    <editable-list name="shoppingList" max-level="1" value='[
    {"title": "牛奶"},
    {"title": "面包"},
    {"title": "鸡蛋"},
    {"title": "水果"},
    {"title": "蔬菜"},
    {"title": "洗发水"},
    {"title": "洗衣液"}
  ]'></editable-list>
  

[{'title': '概览', 'items': [{'title': '概述南京大屠杀的历史背景、事件经过及其在国际社会中的影响与地位。', 'items': []}]}, {'title': '时间线', 'items': [{'title': '梳理南京大屠杀事件的时间线，包括关键事件和日期。', 'items': []}, {'title': '事件起因', 'items': [{'title': '分析南京大屠杀事件发生的背景和原因。', 'items': []}]}, {'title': '事件经过', 'items': [{'title': '详细记录南京大屠杀事件的过程，包括日军攻占南京和随后的暴行。', 'items': []}]}, {'title': '国际反应', 'items': [{'title': '概述国际社会对南京大屠杀事件的反应和介入。', 'items': []}]}]}, {'title': '指挥系统', 'items': [{'title': '分析日军南京大屠杀指挥系统的结构和运作方式。', 'items': []}, {'title': '指挥体系', 'items': [{'title': '描述日军南京大屠杀指挥系统的层级和组成。', 'items': []}]}, {'title': '指挥策略', 'items': [{'title': '探讨日军南京大屠杀指挥策略的特点和影响。', 'items': []}]}]}, {'title': '幸存者口述', 'items': [{'title': '收集和整理南京大屠杀幸存者的口述历史资料。', 'items': []}, {'title': '口述内容', 'items': [{'title': '记录幸存者的亲身经历和见证。', 'items': []}]}, {'title': '心理影响', 'items': [{'title': '分析南京大屠杀对幸存者心理的影响。', 'items': []}]}]}, {'title': '遇难者名单与统计', 'items': [{'title': '整理南京大屠杀遇难者名单和统计数据。', 'items': []}, {'title': '名单整理', 'items': [{'title': '收集并整理遇难者名单。', 'items': []}]}, {'title': '统计数据', 'items': [{'title': '分析遇难者的性别、年龄、职业等统计数据。', 'items': []}]}]}, {'title': '国际条约文献', 'items': [{'title': '收集和分析与南京大屠杀相关的国际条约文献。', 'items': []}, {'title': '条约背景', 'items': [{'title': '介绍相关国际条约的背景和内容。', 'items': []}]}, {'title': '条约执行', 'items': [{'title': '分析国际条约在南京大屠杀事件中的作用和执行情况。', 'items': []}]}]}, {'title': '历史照片与影像', 'items': [{'title': '收集和整理南京大屠杀的历史照片与影像档案。', 'items': []}, {'title': '照片分析', 'items': [{'title': '分析历史照片所反映的事件现场和遇难者情况。', 'items': []}]}, {'title': '影像资料', 'items': [{'title': '整理和分析相关的影像资料，如纪录片、新闻片段等。', 'items': []}]}]}, {'title': '总结', 'items': [{'title': '总结南京大屠杀的历史意义，提出对和平与正义的思考，以及对未来研究的展望。', 'items': []}]}]

  <editable-list name="taskList" max-level="3" value='[
    {"title": "工作任务", "items": [
      {"title": "完成项目报告"}, 
      {"title": "回复邮件"}, 
      {"title": "参加团队会议"}
    ]},
    {"title": "个人任务", "items": [
      {"title": "健身", "items": [
        {"title": "跑步 30 分钟"},
        {"title": "力量训练"}
      ]},
      {"title": "阅读"},
      {"title": "购物清单", "items": [
        {"title": "牛奶"},
        {"title": "面包"},
        {"title": "蔬菜"}
      ]}
    ]},
    {"title": "学习计划", "items": [
      {"title": "学习 React"},
      {"title": "完成在线课程"}
    ]}
  ]'></editable-list>

## 组合使用示例

<form data-format="json" readonly="true">
<label for="username">用户名:</label>
<input type="text" name="username" value="张三" />
<label for="email">电子邮箱:</label>
<input type="email" name="email" value="zhangsan@example.com" />
<label>性别:</label>
<input type="radio" name="gender" value="male" label="男" checked="true" />
<input type="radio" name="gender" value="female" label="女" />
<label for="description">个人简介:</label>
<textarea name="description">这是一段只读的个人简介内容，用户无法编辑这段文字。</textarea>
<!-- 强制显示按钮（即使在只读表单中） -->
<button data-size="medium" data-variant="secondary" force="true">打印信息</button>
</form>

### 单个字段设为只读
<form data-format="json">
<label for="id">用户ID:</label>
<input type="text" name="id" value="USER123456" readonly="true" />
<label for="username">用户名:</label>
<input type="text" name="username" placeholder="请输入用户名" />
<label for="role">角色:</label>
<select name="role" readonly="true">
<option value="user">普通用户</option>
<option value="admin" selected>管理员</option>
<option value="guest">访客</option>
</select>
<editable-list
name="permissions"
label="权限列表"
readonly="true"
value='["查看报表", "管理用户", "系统设置"]'
></editable-list>
<button data-size="medium" data-variant="primary">保存修改</button>
</form>

### 级联列表只读示例
<editable-list
name="project_structure"
label="项目结构"
cascading="true"
readonly="true"
value='[
{
"id": "phase1",
"value": "需求分析",
"children": [
{
"id": "task1",
"value": "用户访谈",
"children": []
},
{
"id": "task2",
"value": "需求文档编写",
"children": []
}
]
},
{
"id": "phase2",
"value": "设计阶段",
"children": [
{
"id": "task3",
"value": "UI设计",
"children": []
}
]
}
]'
></editable-list>

### 用户注册表单
<form data-format="json">
<label for="fullname">姓名:</label>
<input type="text" name="fullname" placeholder="请输入您的姓名" />
<label for="email">电子邮箱:</label>
<input type="email" name="email" placeholder="your@email.com" />
<label for="password">密码:</label>
<input type="password" name="password" placeholder="请设置密码" />
<label>性别:</label>
<input type="radio" name="gender" value="male" label="男" />
<input type="radio" name="gender" value="female" label="女" />
<input type="radio" name="gender" value="other" label="其他" />
<label for="occupation">职业:</label>
<select name="occupation">
<option value="student">学生</option>
<option value="engineer">工程师</option>
<option value="teacher">教师</option>
<option value="other">其他</option>
</select>
<input type="checkbox" name="terms" label="我已阅读并同意用户协议" />
<input type="checkbox" name="newsletter" label="我愿意接收产品更新和营销邮件" />
<button data-size="medium" data-variant="primary">注册账号</button>
</form>


### 调查问卷表单
<form data-format="json">
<label for="name">您的姓名:</label>
<input type="text" name="name" placeholder="请输入姓名" />
<label for="age">年龄段:</label>
<select name="age">
<option value="under18">18岁以下</option>
<option value="18-25">18-25岁</option>
<option value="26-35">26-35岁</option>
<option value="36-45">36-45岁</option>
<option value="above45">45岁以上</option>
</select>
<label>您最常使用的设备:</label>
<input type="radio" name="device" value="smartphone" label="智能手机" />
<input type="radio" name="device" value="tablet" label="平板电脑" />
<input type="radio" name="device" value="laptop" label="笔记本电脑" />
<input type="radio" name="device" value="desktop" label="台式电脑" />
<label>您感兴趣的领域有哪些:</label>
<input type="checkbox" name="interest_tech" label="科技" />
<input type="checkbox" name="interest_health" label="健康" />
<input type="checkbox" name="interest_travel" label="旅游" />
<input type="checkbox" name="interest_finance" label="金融" />
<input type="checkbox" name="interest_sports" label="体育" />
<label for="feedback">您对我们产品的建议:</label>
<textarea name="feedback" placeholder="请输入您的建议..."></textarea>
<editable-list name="improvements" label="您希望我们改进的地方" placeholder="添加建议项..."></editable-list>
<button data-size="medium" data-variant="primary">提交问卷</button>
</form>

### 项目管理表单
<form data-format="json">
<label for="project_name">项目名称:</label>
<input type="text" name="project_name" placeholder="请输入项目名称" />
<label for="project_desc">项目描述:</label>
<textarea name="project_desc" placeholder="请简要描述项目内容和目标..."></textarea>
<label for="deadline">预计完成日期:</label>
<input type="text" name="deadline" placeholder="例如：2025-12-31" />
<label>项目类型:</label>
<input type="radio" name="project_type" value="development" label="开发" checked="true" />
<input type="radio" name="project_type" value="design" label="设计" />
<input type="radio" name="project_type" value="research" label="研究" />
<input type="radio" name="project_type" value="marketing" label="营销" />
<label for="priority">优先级:</label>
<select name="priority">
<option value="low">低</option>
<option value="medium">中</option>
<option value="high">高</option>
<option value="urgent">紧急</option>
</select>
<label>所需资源:</label>
<input type="checkbox" name="resources_developers" label="开发人员" />
<input type="checkbox" name="resources_designers" label="设计师" />
<input type="checkbox" name="resources_managers" label="项目经理" />
<input type="checkbox" name="resources_equipment" label="硬件设备" />
<editable-list name="milestones" label="项目里程碑" placeholder="添加项目里程碑..."></editable-list>
<editable-list name="team_members" label="团队成员" value='["项目经理", "UI设计师", "前端开发", "后端开发"]'></editable-list>
<button data-size="medium" data-variant="primary">创建项目</button>
</form>

## 表单数据格式

表单支持两种数据提交格式:

### 文本格式 (默认)
<form data-format="text">
<!-- 表单元素 -->
</form>

将以 `key: value` 的文本格式提交，每行一个字段。

### JSON 格式
<form data-format="json">
<!-- 表单元素 -->
</form>

将以 JSON 对象格式提交，如 `{"name":"张三","age":30}`。

## 按钮样式

按钮支持不同的尺寸和变体:
<!-- 主要按钮 -->
<button data-size="small" data-variant="primary">小按钮</button>
<button data-size="medium" data-variant="primary">中等按钮</button>
<button data-size="large" data-variant="primary">大按钮</button>
<!-- 次要按钮 -->
<button data-size="medium" data-variant="secondary">次要按钮</button>
<!-- 其他变体 -->
<button data-size="medium" data-variant="warning">警告按钮</button>