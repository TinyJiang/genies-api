# 网投新老框架融合说明

------
新老框架融合，主要修改大致可以分为以下几个步骤：
> * 现有的ecip老框架用户角色等数据同步至新框架数据库
> * 新框架引用ecip-connector依赖发布rest服务，供老框架调用查询
> * 老框架删除原先所有的查询逻辑，改为调用新框架服务查询用户，菜单等数据
> * 老框架鉴权剥离
> * 老框架开放模块访问接口给新框架访问
> * 老框架皮肤适配
------

##	1.	数据同步
数据同步由 `kettle` 完成，逻辑规则已经写好，设置 `两个数据源` 即可直接使用

###	表对应关系
> 1. SYS_USER
> * SYS_ROLE
> * SYS_USERROLE
> * SYS_USERDEPARTMENT
> * SYS_XMENUITEM—>SYS_RESCOURCE
> * SYS_PERMISSION+SYS_MENUPERMISSION_REL—>SYS_RESCOURCE
> * SYS_ROLEMENUITEM—>SYS_ROLERESOURCE
> * SYS_REGIONROLE—>SYS_ROLEREGION
> * SYS_ORGANIZATION_STRUCTURE—>SYS_DEPARTMENT
> * SYS_USERROLE
> * SYS_XCOMMON—>SYS_COMMONDATAS

##	2.	新框架引用ecip-connector
`ecip-connector`依赖主要用于发布老框架查询数据所需的 `rest服务`

```xml
	<dependency>
			<groupId>com.eastcom_sw.baseframe.ncsp-common.ecip-connector</groupId>
			<artifactId>import-ecip-connector</artifactId>
			<version>${baseframe.version}</version>
			<type>pom</type>
	</dependency>
```

##	3.	老框架数据查询方法切换
老框架的 `Cache查询服务` 全部由ncsp提供的服务替换，ecip中统一使用 `NcspSysmngSendService` 类访问菜单，用户，基础数据等数据。

##	4.	老框架鉴权剥离
老框架的鉴权逻辑写在 `主页面框架` 中，引入至新框架之后鉴权逻辑将会**失效**，故需要将鉴权逻辑下放至每个页面。需要修改/WebContent/common/phoneNumberWithEmos.jsp，/WebContent/scripts/sysmanager/EOMSCheck.js。每个调用了鉴权窗口的业务页面也都需要进行相应的适配，将原先的 `parent.` 去掉。

##	5.	老框架开放访问接口
在老框架中添加ncspVisitor.jsp页面，供新框架访问老框架功能时调用，主要是一个**登录判断**以及**单点登录**逻辑。

##	6.	老框架皮肤适配
当前浙江网投系统老框架中添加了一套`蓝色皮肤`。力求做到新框架访问老框架功能时展现的比较和谐美观。