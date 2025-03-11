# Markdown 表单组件用法示例

本文档展示了所有支持的表单组件标签和类型的使用方法，可以在 Markdown 中直接使用这些标签创建交互式表单。

## 基本表单示例

以下是一个包含多种表单元素的完整示例：
html
<form data-format="json">
<label for="username">用户名:</label>
<input type="text" name="username" placeholder="请输入用户名" />
<label for="password">密码:</label>
<input type="password" name="password" placeholder="请输入密码" />
<label for="message">留言内容:</label>
<textarea name="message" placeholder="请输入留言内容"></textarea>
<button data-size="small" data-variant="primary">提交表单</button>
</form>
## 所有支持的表单元素

### 文本输入框 (Text Input)
html
<label for="fullname">姓名:</label>
<input type="text" name="fullname" placeholder="请输入您的姓名" />

### 密码输入框 (Password Input)
html
<label for="password">密码:</label>
<input type="password" name="password" placeholder="请输入密码" />

### 邮箱输入框 (Email Input)
html
<label for="email">邮箱:</label>
<input type="email" name="email" placeholder="example@domain.com" />

### 数字输入框 (Number Input)
html
<label for="age">年龄:</label>
<input type="number" name="age" placeholder="请输入年龄" />

### 多行文本输入 (Textarea)
html
<label for="description">描述:</label>
<textarea name="description" placeholder="请输入详细描述"></textarea>

### 下拉选择框 (Select)
html
<label for="country">国家/地区:</label>
<select name="country">
<option value="china">中国</option>
<option value="usa">美国</option>
<option value="japan">日本</option>
<option value="uk">英国</option>
</select>

### 单个复选框 (Single Checkbox)
html
<input type="checkbox" name="agreement" label="我同意服务条款和隐私政策" />

### 单个单选按钮 (Single Radio Button)
html
<input type="radio" name="subscription" value="monthly" label="按月订阅" />
<input type="radio" name="subscription" value="yearly" label="按年订阅" />

### 单选按钮组 (Radio Group)
html
<radio-group name="gender" label="性别">
<option value="male">男</option>
<option value="female">女</option>
<option value="other">其他</option>
</radio-group>

带有初始值的单选按钮组:
html
<radio-group name="plan" label="选择套餐" initial-value="pro">
<option value="basic">基础版</option>
<option value="pro">专业版</option>
<option value="enterprise">企业版</option>
</radio-group>

### 复选框组 (Checkbox Group)
html
<checkbox-group name="hobbies" label="兴趣爱好">
<option value="reading">阅读</option>
<option value="sports">运动</option>
<option value="music">音乐</option>
<option value="travel">旅行</option>
</checkbox-group>

带有初始值的复选框组:
html
<checkbox-group name="skills" label="专业技能" initial-value='["html", "css"]'>
<option value="html">HTML</option>
<option value="css">CSS</option>
<option value="javascript">JavaScript</option>
<option value="react">React</option>
</checkbox-group>

### 嵌套列表 (Nested List)
html
<nested-list name="tasks" label="任务计划"></nested-list>

带有初始值的嵌套列表:
html
<nested-list
name="project_outline"
label="项目大纲"
initial-value='[
{
"id": "item1",
"value": "需求分析",
"children": [
{
"id": "item1_1",
"value": "用户需求调研",
"children": []
},
{
"id": "item1_2",
"value": "功能需求分析",
"children": []
}
]
},
{
"id": "item2",
"value": "设计阶段",
"children": []
}
]'
></nested-list>

### 提交按钮 (Submit Button)
html
<button data-size="small" data-variant="primary">提交</button>

按钮支持不同的尺寸和变体:
html
<!-- 大尺寸主要按钮 -->
<button data-size="large" data-variant="primary">大按钮</button>
<!-- 中等尺寸次要按钮 -->
<button data-size="medium" data-variant="secondary">中等按钮</button>
<!-- 小尺寸警告按钮 -->
<button data-size="small" data-variant="warning">警告按钮</button>

## 表单数据格式

表单支持两种数据提交格式:

### 文本格式 (默认)
html
<form data-format="text">
<!-- 表单元素 -->
</form>

### JSON 格式
html
<form data-format="json">
<!-- 表单元素 -->
</form>

## 复杂表单示例

以下是一个包含多种表单元素的复杂表单示例:
html
<form data-format="json">
<label for="project_name">项目名称:</label>
<input type="text" name="project_name" placeholder="请输入项目名称" />
<radio-group name="project_type" label="项目类型">
<option value="web">Web应用</option>
<option value="mobile">移动应用</option>
<option value="desktop">桌面应用</option>
</radio-group>
<checkbox-group name="technologies" label="使用技术">
<option value="react">React</option>
<option value="vue">Vue</option>
<option value="angular">Angular</option>
<option value="node">Node.js</option>
<option value="python">Python</option>
</checkbox-group>
<label for="team_size">团队规模:</label>
<input type="number" name="team_size" placeholder="请输入团队人数" />
<label for="development_approach">开发方法:</label>
<select name="development_approach">
<option value="agile">敏捷开发</option>
<option value="waterfall">瀑布模型</option>
<option value="scrum">Scrum</option>
<option value="kanban">看板方法</option>
</select>
<nested-list name="milestones" label="项目里程碑"></nested-list>
<label for="description">项目描述:</label>
<textarea name="description" placeholder="请输入项目详细描述"></textarea>
<input type="checkbox" name="terms_agreement" label="我已阅读并同意项目条款" />
<button data-size="medium" data-variant="primary">提交项目信息</button>
</form>

## 使用注意事项

1. 所有输入元素必须有 `name` 属性，此属性将作为提交数据的键名
2. `radio-group` 和 `checkbox-group` 中的 `option` 元素必须有 `value` 属性
3. 嵌套列表支持无限层级的项目结构
4. 表单默认使用文本格式提交数据，可以通过 `data-format="json"` 更改为 JSON 格式
5. 按钮支持 `data-size` 和 `data-variant` 属性来定制外观

用法说明
这个 form-usage-examples.md 文件提供了详细的使用示例，包含了所有支持的表单元素和类型。要实际使用这些组件，用户只需要在 Markdown 内容中添加相应的 HTML 标签。
这些标签会被解析并渲染为交互式表单组件，用户可以填写信息并提交。表单提交后，数据会根据 data-format 属性的值以文本或 JSON 格式发送。