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
    ViduTaskType["TEXT2VIDEO"] = "text2video";
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
    [ViduTaskType.TEXT2VIDEO]: 'ent/v2/text2video',
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
                'style': '视频风格',
                'text2video': '文生视频',
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
                'general': '写实风',
                'anime': '动漫风',
                'auto': '自动',
                'small': '小',
                'medium': '中',
                'large': '大',
                'choose_task_type': '请选择任务类型',
                'prompt_placeholder': '图片中的人们对着屏幕比心',
                'bgm': '背景音乐',
                'bgm_on': '开启',
                'bgm_off': '关闭',
                'aspect_ratio': '生视频比例',
                'style_placeholder': '只有文生视频支持风格选择'
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
                'text2video': 'Text to Video',
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
                'general': 'Realistic',
                'anime': 'Anime Style',
                'auto': 'Auto',
                'small': 'Small',
                'medium': 'Medium',
                'large': 'Large',
                'choose_task_type': 'Please select a task type',
                'prompt_placeholder': 'The astronaut waved and the camera moved up.',
                'bgm': 'Background Music',
                'bgm_on': 'On',
                'bgm_off': 'Off',
                'aspect_ratio': 'Aspect Ratio',
                'style_placeholder': 'Only text-to-video supports style selection',
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
                    { label: t('text2video'), value: ViduTaskType.TEXT2VIDEO },
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
                required: false,
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
            key: 'aspect_ratio',
            label: t('aspect_ratio'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '16:9', value: '16:9' },
                    { label: '9:16', value: '9:16' },
                    { label: '1:1', value: '1:1' },
                ]
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'style',
            label: t('style'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                placeholder: t('style_placeholder'),
                options: [
                    { label: t('general'), value: 'general' },
                    { label: t('anime'), value: 'anime' }
                ]
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'bgm',
            label: t('bgm'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: t('bgm_on'), value: true },
                    { label: t('bgm_off'), value: false }
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
        const { env, taskType, model, prompt, images, duration, resolution, aspect_ratio, style, bgm, movementAmplitude, } = formItemParams;
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
            const taskId = await callViduEntApi(context, env.value, taskType.value, model.value, imageUrls, prompt, duration?.value, resolution?.value, aspect_ratio?.value, style?.value, movementAmplitude?.value, bgm?.value);
            debugLog({
                '===2 Vidu API调用结果': taskId
            });
            const taskResult = await getTaskResult(context, env.value, taskId);
            const creation = taskResult.creations?.[0];
            const creationUrl = creation?.url || '';
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
async function callViduEntApi(context, env, taskType, model, images, prompt, duration, resolution, aspect_ratio, style, movementAmplitude, bgm) {
    try {
        const endpoint = TaskTypeEndpoint[taskType];
        const apiUrl = ViduEnvApi[env];
        const requestData = {
            model,
            prompt,
            images,
            duration,
            resolution,
            aspect_ratio,
            style: style,
            movement_amplitude: movementAmplitude,
            bgm,
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
        return viduResponse.task_id;
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
        if (!images) {
            return;
        }
        const imageUrls = images.map((imageAttachments) => imageAttachments.map((image) => image.tmp_url));
        return imageUrls.flat().filter((url) => url !== undefined);
    }
    catch (error) {
        throw new Error(`提取图片URL失败: ${error.message}`);
    }
}
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNkk7QUFDN0ksK0JBQW9DO0FBRXBDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLG1CQUFtQjtBQUNuQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQztJQUNwQixXQUFXO0lBQ1gsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2YsYUFBYTtJQUNiLGNBQWM7Q0FDZixDQUFDLENBQUM7QUFFSCxlQUFlO0FBQ2YsSUFBSyxZQUtKO0FBTEQsV0FBSyxZQUFZO0lBQ2YseUNBQXlCLENBQUE7SUFDekIsdUNBQXVCLENBQUE7SUFDdkIsbURBQW1DLENBQUE7SUFDbkMsaURBQWlDLENBQUE7QUFDbkMsQ0FBQyxFQUxJLFlBQVksS0FBWixZQUFZLFFBS2hCO0FBRUQsYUFBYTtBQUNiLElBQUssU0FJSjtBQUpELFdBQUssU0FBUztJQUNaLDhCQUFpQixDQUFBO0lBQ2pCLGdDQUFtQixDQUFBO0lBQ25CLGdDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFKSSxTQUFTLEtBQVQsU0FBUyxRQUliO0FBR0QsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxtQkFBbUI7SUFDOUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsa0JBQWtCO0lBQzVDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxFQUFFLHdCQUF3QjtJQUN4RCxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRSx3QkFBd0I7Q0FDeEQsQ0FBQTtBQUdELElBQUssT0FHSjtBQUhELFdBQUssT0FBTztJQUNWLHdCQUFhLENBQUE7SUFDYiw0QkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSEksT0FBTyxLQUFQLE9BQU8sUUFHWDtBQUVELE1BQU0sVUFBVSxHQUFHO0lBQ2pC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