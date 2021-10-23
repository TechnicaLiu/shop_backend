import Vue from 'vue'
         
import { Button, Form, FormItem, Input ,Menu,Submenu,MenuItem,MenuItemGroup,Tooltip,Pagination,Dialog} from 'element-ui'
import { Message,Steps ,Step} from 'element-ui'
import { Container } from 'element-ui'
import { Header } from 'element-ui'
import { Aside } from 'element-ui'
import { Main } from 'element-ui'
import { Footer } from 'element-ui'
import { Card } from 'element-ui'
import{ Breadcrumb } from 'element-ui'
import{ BreadcrumbItem } from 'element-ui'
import{ Row } from 'element-ui'
import{ Col , Tabs,TabPane } from 'element-ui'
import{ Table,TableColumn,CheckboxGroup,Checkbox,Upload } from 'element-ui'
import {Switch,MessageBox,Tag,Tree,Select,Option,Cascader,Alert} from 'element-ui'

import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps) 
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)

Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm=MessageBox.confirm 