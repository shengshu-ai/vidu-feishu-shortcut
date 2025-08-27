"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const uuid_1 = require("uuid");
const { t } = block_basekit_server_api_1.field;
// 添加Vidu API域名到白名单
block_basekit_server_api_1.basekit.addDomainList([
    'feishu.cn',
    'feishucdn.com',
    'larksuitecdn.com',
    'larksuite.com',
    'api.vidu.cn',
    'api.vidu.com',
]);
// 定义Vidu任务类型枚举
var ViduTaskType;
(function (ViduTaskType) {
    ViduTaskType["IMG2VIDEO"] = "img2video";
    ViduTaskType["REFERENCE2VIDEO"] = "reference2video";
    ViduTaskType["STARTEND2VIDEO"] = "startend2video";
})(ViduTaskType || (ViduTaskType = {}));
// 定义Vidu模型枚举
var ViduModel;
(function (ViduModel) {
    ViduModel["VIDUQ1"] = "viduq1";
    ViduModel["VIDU1_5"] = "vidu1.5";
    ViduModel["VIDU2_0"] = "vidu2.0";
})(ViduModel || (ViduModel = {}));
const TaskTypeEndpoint = {
    [ViduTaskType.IMG2VIDEO]: 'ent/v2/img2video',
    [ViduTaskType.REFERENCE2VIDEO]: 'ent/v2/reference2video',
    [ViduTaskType.STARTEND2VIDEO]: 'ent/v2/start-end2video'
};
var ViduEnv;
(function (ViduEnv) {
    ViduEnv["PROD"] = "prod";
    ViduEnv["PROD_S"] = "prod_s";
})(ViduEnv || (ViduEnv = {}));
const ViduEnvApi = {
    [ViduEnv.PROD]: 'https://api.vidu.cn',
    [ViduEnv.PROD_S]: 'https://api.vidu.com'
};
block_basekit_server_api_1.basekit.addField({
    authorizations: [
        {
            id: 'vidu_auth', // 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
            platform: 'vidu', // 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
            type: block_basekit_server_api_1.AuthorizationType.MultiHeaderToken,
            required: true,
            params: [
                { key: "Authorization", placeholder: "Authorization" },
            ],
            instructionsUrl: "https://shengshu.feishu.cn/docx/Fiz7drhdroWG59xpGsAcfA8Xn9b", // 帮助链接，告诉使用者如何填写这个apikey
            label: 'vidu授权',
            icon: {
                light: '',
                dark: ''
            }
        }
    ],
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                'env': 'API环境',
                'prod': '国内',
                'prod_s': '海外',
                'task_type': '任务类型',
                'model': '模型选择',
                'images': '图片输入',
                'prompt': '提示词',
                'duration': '视频时长',
                'resolution': '分辨率',
                'movement_amplitude': '运动幅度',
                'style': '风格',
                'img2video': '图生视频',
                'reference2video': '参考生视频',
                'startend2video': '首尾帧生视频',
                'viduq1': 'ViduQ1模型',
                'vidu1_5': 'Vidu1.5模型',
                'vidu2_0': 'Vidu2.0模型',
                'task_id': '任务ID',
                'status': '状态',
                'video_url': '视频链接',
                'cover_url': '封面链接',
                'general': '通用风格',
                'anime': '动漫风格',
                'auto': '自动',
                'small': '小',
                'medium': '中',
                'large': '大',
                'choose_task_type': '请选择任务类型',
                'prompt_placeholder': '图片中的人们对着屏幕比心',
            },
            'en-US': {
                'env': 'API Environment',
                'prod': 'China',
                'prod_s': 'Global',
                'task_type': 'Task Type',
                'model': 'Model Selection',
                'images': 'Image Input',
                'prompt': 'Prompt',
                'duration': 'Duration',
                'resolution': 'Resolution',
                'movement_amplitude': 'Movement Amplitude',
                'style': 'Style',
                'img2video': 'Image to Video',
                'reference2video': 'Reference to Video',
                'startend2video': 'Start-End to Video',
                'viduq1': 'ViduQ1 Model',
                'vidu1_5': 'Vidu1.5 Model',
                'vidu2_0': 'Vidu2.0 Model',
                'task_id': 'Task ID',
                'status': 'Status',
                'video_url': 'Video URL',
                'cover_url': 'Cover URL',
                'general': 'General Style',
                'anime': 'Anime Style',
                'auto': 'Auto',
                'small': 'Small',
                'medium': 'Medium',
                'large': 'Large',
                'choose_task_type': 'Please select a task type',
                'prompt_placeholder': 'The astronaut waved and the camera moved up.',
            }
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'env',
            label: t('env'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: { label: t('prod'), value: ViduEnv.PROD },
            props: {
                options: [
                    { label: t('prod'), value: ViduEnv.PROD },
                    { label: t('prod_s'), value: ViduEnv.PROD_S }
                ]
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'taskType',
            label: t('task_type'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: { label: t('img2video'), value: ViduTaskType.IMG2VIDEO },
            props: {
                options: [
                    { label: t('img2video'), value: ViduTaskType.IMG2VIDEO },
                    { label: t('reference2video'), value: ViduTaskType.REFERENCE2VIDEO },
                    { label: t('startend2video'), value: ViduTaskType.STARTEND2VIDEO }
                ]
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'model',
            label: t('model'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: { label: t('viduq1'), value: ViduModel.VIDUQ1 },
            props: {
                options: [
                    { label: 'Vidu Q1', value: ViduModel.VIDUQ1 },
                    { label: 'Vidu 1.5', value: ViduModel.VIDU1_5 },
                    { label: 'Vidu 2.0', value: ViduModel.VIDU2_0 }
                ]
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'prompt',
            label: t('prompt'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('prompt_placeholder'),
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'images',
            label: t('images'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
                mode: 'multiple',
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'duration',
            label: t('duration'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '4s', value: 4 },
                    { label: '5s', value: 5 },
                    { label: '8s', value: 8 }
                ]
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'resolution',
            label: t('resolution'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '360p', value: '360p' },
                    { label: '720p', value: '720p' },
                    { label: '1080p', value: '1080p' }
                ]
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'movementAmplitude',
            label: t('movement_amplitude'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: 'auto', value: 'auto' },
                    { label: 'small', value: 'small' },
                    { label: 'medium', value: 'medium' },
                    { label: 'large', value: 'large' }
                ]
            },
            validator: {
                required: false,
            }
        }
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment
    },
    // 主要执行逻辑
    execute: async (formItemParams, context) => {
        const { env, taskType, model, prompt, images, duration, resolution, movementAmplitude, } = formItemParams;
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            // @ts-ignore
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }));
            console.log('--------------------------------');
        }
        try {
            debugLog('===1 开始执行Vidu API调用');
            // 根据任务类型调用不同的Vidu API
            const imageUrls = extractImageUrls(images);
            const creationUrl = await callViduEntApi(context, env.value, taskType.value, model.value, imageUrls, prompt, duration?.value, resolution?.value, movementAmplitude?.value);
            debugLog({
                '===2 Vidu API调用结果': creationUrl
            });
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                data: [{
                        name: `${(0, uuid_1.v4)()}.mp4`,
                        content: creationUrl,
                        contentType: "attachment/url"
                    }]
            };
        }
        catch (error) {
            debugLog({
                '===3 执行出错': error.message || '未知错误'
            });
            throw error;
        }
    }
});
/**
 * 调用Vidu图生视频API
 */
async function callViduEntApi(context, env, taskType, model, images, prompt, duration, resolution, movementAmplitude) {
    try {
        const endpoint = TaskTypeEndpoint[taskType];
        const apiUrl = ViduEnvApi[env];
        const requestData = {
            model,
            prompt,
            images,
            duration,
            resolution,
            movement_amplitude: movementAmplitude
        };
        const response = await context.fetch(`${apiUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        }, 'vidu_auth');
        if (!response.ok) {
            throw new Error(`图生视频API调用失败: ${response.statusText}`);
        }
        const data = await response.json();
        const viduResponse = data;
        if (!viduResponse.task_id) {
            throw new Error('API响应缺少task_id');
        }
        const taskResult = await getTaskResult(context, env, viduResponse.task_id);
        const creation = taskResult.creations?.[0];
        return creation?.url || '';
    }
    catch (error) {
        throw new Error(`task failed: ${error}`);
    }
}
async function getTaskResult(context, env, taskId) {
    const apiUrl = ViduEnvApi[env];
    while (true) {
        const response = await context.fetch(`${apiUrl}/ent/v2/tasks/${taskId}/creations`, {
            method: 'GET',
        }, 'vidu_auth');
        const data = await response.json();
        if (data.state === 'success') {
            return data;
        }
        if (data.state === 'failed') {
            throw new Error(`图生视频API调用失败: ${data.err_code}`);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}
/**
 * 从飞书附件中提取图片URL
 */
function extractImageUrls(images) {
    try {
        const imageUrls = images.map((imageAttachment) => {
            const image = imageAttachment?.[0];
            if (image) {
                return image.tmp_url;
            }
        });
        return imageUrls.filter((url) => url !== undefined);
    }
    catch (error) {
        throw new Error(`提取图片URL失败: ${error.message}`);
    }
}
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNkk7QUFDN0ksK0JBQW9DO0FBRXBDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLG1CQUFtQjtBQUNuQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQztJQUNwQixXQUFXO0lBQ1gsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2YsYUFBYTtJQUNiLGNBQWM7Q0FDZixDQUFDLENBQUM7QUFFSCxlQUFlO0FBQ2YsSUFBSyxZQUlKO0FBSkQsV0FBSyxZQUFZO0lBQ2YsdUNBQXVCLENBQUE7SUFDdkIsbURBQW1DLENBQUE7SUFDbkMsaURBQWlDLENBQUE7QUFDbkMsQ0FBQyxFQUpJLFlBQVksS0FBWixZQUFZLFFBSWhCO0FBRUQsYUFBYTtBQUNiLElBQUssU0FJSjtBQUpELFdBQUssU0FBUztJQUNaLDhCQUFpQixDQUFBO0lBQ2pCLGdDQUFtQixDQUFBO0lBQ25CLGdDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFKSSxTQUFTLEtBQVQsU0FBUyxRQUliO0FBR0QsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRSxrQkFBa0I7SUFDNUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEVBQUUsd0JBQXdCO0lBQ3hELENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUFFLHdCQUF3QjtDQUN4RCxDQUFBO0FBR0QsSUFBSyxPQUdKO0FBSEQsV0FBSyxPQUFPO0lBQ1Ysd0JBQWEsQ0FBQTtJQUNiLDRCQUFpQixDQUFBO0FBQ25CLENBQUMsRUFISSxPQUFPLEtBQVAsT0FBTyxRQUdYO0FBRUQsTUFBTSxVQUFVLEdBQUc7SUFDakIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUscUJBQXFCO0lBQ3JDLENBQUMsT0FBTyxDQUFDLE1B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