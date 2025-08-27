import { basekit, FieldType, field, FieldComponent, FieldCode, AuthorizationType, FieldContext } from '@lark-opdev/block-basekit-server-api';
import { v4 as uuidv4 } from 'uuid';

const { t } = field;

// 添加Vidu API域名到白名单
basekit.addDomainList([
  'feishu.cn', 
  'feishucdn.com', 
  'larksuitecdn.com', 
  'larksuite.com',
  'api.vidu.cn', 
  'api.vidu.com',
]);

// 定义Vidu任务类型枚举
enum ViduTaskType {
  IMG2VIDEO = 'img2video',
  REFERENCE2VIDEO = 'reference2video',
  STARTEND2VIDEO = 'startend2video'
}

// 定义Vidu模型枚举
enum ViduModel {
  VIDUQ1 = 'viduq1',
  VIDU1_5 = 'vidu1.5',
  VIDU2_0 = 'vidu2.0'
}


const TaskTypeEndpoint = {
  [ViduTaskType.IMG2VIDEO]: 'ent/v2/img2video',
  [ViduTaskType.REFERENCE2VIDEO]: 'ent/v2/reference2video',
  [ViduTaskType.STARTEND2VIDEO]: 'ent/v2/start-end2video'
}


enum ViduEnv {
  PROD = 'prod',
  PROD_S = 'prod_s'
}

const ViduEnvApi = {
  [ViduEnv.PROD]: 'https://api.vidu.cn',
  [ViduEnv.PROD_S]: 'https://api.vidu.com'
}

// 定义Vidu API响应类型
interface ViduApiResponse {
  task_id: string;
  type: string;
  state: 'created' | 'processing' | 'queueing' | 'success' | 'failed';
  model: string;
  style?: string;
  prompt?: string;
  images?: string[];
  duration?: number;
  seed?: number;
  aspect_ratio?: string;
  resolution?: string;
  movement_amplitude?: string;
  created_at?: string;
  credits?: number;
  payload?: string;
  cus_priority?: number;
  off_peak?: boolean;
}

interface Creation {
  id: string;
  state: string;
  url: string;
}

interface ViduGetCreationsResult {
  id: string;
  state: 'created' | 'processing' | 'queueing' | 'success' | 'failed';
  creations: Creation[];
  err_code: string;
}

// 定义Vidu API请求参数类型
interface ViduApiRequest {
  model: string;
  style?: 'general' | 'anime';
  prompt?: string;
  images: string[];
  duration?: number;
  seed?: number;
  aspect_ratio?: string;
  resolution?: string;
  movement_amplitude?: 'auto' | 'small' | 'medium' | 'large';
  enhance?: boolean;
  moderation?: 'unspecified' | 'strict' | 'lenient' | 'disabled';
  callback_url?: string;
  priority?: number;
  bgm?: boolean;
  payload?: string;
  cus_priority?: number;
  off_peak?: boolean;
}

basekit.addField({
  authorizations: [
    {
      id: 'vidu_auth',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
      platform: 'vidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
      type: AuthorizationType.MultiHeaderToken,
      required: true,
      params: [
        { key: "Authorization", placeholder: "Authorization" },
      ],
      instructionsUrl: "https://shengshu.feishu.cn/docx/Fiz7drhdroWG59xpGsAcfA8Xn9b",// 帮助链接，告诉使用者如何填写这个apikey
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
        mode: 'multiple',
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'duration',
      label: t('duration'),
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.SingleSelect,
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
    type: FieldType.Attachment
  },
  // 主要执行逻辑
  execute: async (formItemParams, context) => {
    const { 
      env,
      taskType,
      model,
      prompt, 
      images,  
      duration, 
      resolution,
      movementAmplitude,
    } = formItemParams;

    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      // @ts-ignore
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
      console.log('--------------------------------')
    }

    try {
      debugLog('===1 开始执行Vidu API调用');
      // 根据任务类型调用不同的Vidu API
      const imageUrls = extractImageUrls(images);
      const taskId = await callViduEntApi(
        context,
        env.value,
        taskType.value, 
        model.value, 
        imageUrls, 
        prompt, 
        duration?.value, 
        resolution?.value, 
        movementAmplitude?.value,
      );

      debugLog({
        '===2 Vidu API调用结果': taskId
      });

      const taskResult = await getTaskResult(context, env.value, taskId);
      const creation = taskResult.creations?.[0];
      const creationUrl = creation?.url || '';

      return {
        code: FieldCode.Success, // 0 表示请求成功
        data: [{
          name: `${uuidv4()}.mp4`,
          content: creationUrl,
          contentType: "attachment/url"
        }]
      };

    } catch (error: any) {
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
async function callViduEntApi(
  context: FieldContext,
  env: ViduEnv,
  taskType: ViduTaskType,
  model: string, 
  images: string[], 
  prompt: string, 
  duration?: number, 
  resolution?: string, 
  movementAmplitude?: string,
): Promise<string> {
  try {
    const endpoint = TaskTypeEndpoint[taskType];
    const apiUrl = ViduEnvApi[env];
    
    const requestData: ViduApiRequest = {
      model,
      prompt,
      images,
      duration,
      resolution,
      movement_amplitude: movementAmplitude as 'auto' | 'small' | 'medium' | 'large'
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
    const viduResponse = data as ViduApiResponse;
    if (!viduResponse.task_id) {
      throw new Error('API响应缺少task_id');
    }
    return viduResponse.task_id;

  } catch (error: any) {
    throw new Error(`task failed: ${error}`);
  }
}

async function getTaskResult(context: FieldContext, env: ViduEnv, taskId: string): Promise<ViduGetCreationsResult> {
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
function extractImageUrls(images: any[]): string[] {
  try {
    const imageUrls = images.map((imageAttachment) => {
      const image = imageAttachment?.[0];
      if (image) {
        return image.tmp_url;
      }
    });
    return imageUrls.filter((url) => url !== undefined);
  } catch (error: any) {
    throw new Error(`提取图片URL失败: ${error.message}`);
  }
}

export default basekit;