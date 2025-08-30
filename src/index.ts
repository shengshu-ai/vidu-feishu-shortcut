import { basekit, FieldType, field, FieldComponent, FieldCode, AuthorizationType, FieldContext } from '@lark-opdev/block-basekit-server-api';

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
  TEXT2VIDEO = 'text2video',
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
  [ViduTaskType.TEXT2VIDEO]: 'ent/v2/text2video',
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
      id: 'vidu_auth', // 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权
      platform: 'Vidu', // 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单)
      type: AuthorizationType.MultiHeaderToken,
      required: true,
      params: [
        { key: "Authorization", placeholder: "Token xxxxxx" },
      ],
      tooltips: [
        {
          type: 'text',
          content: t('api_key_tooltip')
        },
        {
          type: 'link',
          text: 'Vidu Api Key',
          link: 'https://shengshu.feishu.cn/docx/Fiz7drhdroWG59xpGsAcfA8Xn9b'
        }
      ],
      instructionsUrl: "https://shengshu.feishu.cn/docx/Fiz7drhdroWG59xpGsAcfA8Xn9b",// 帮助链接，告诉使用者如何填写这个apikey
      label: t('vidu_label'),
      icon: {
        light: 'https://scene.vidu.zone/media-asset/091009-VqbUZH57i31ffFX7.png',
        dark: 'https://scene.vidu.zone/media-asset/091029-8rW1nZiVyDlAEw1e.png'
      }
    }
  ],
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'vidu_label': 'Vidu AI视频生成工具',
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
        'api_key_tooltip': '获取密钥请参考 ',
        'aspect_ratio': '生视频比例',
        'style_placeholder': '只有文生视频支持风格选择',
        'images_tooltip': '每种任务类型支持的图片数量请查阅 ',
        'task_type_tooltip': '每种任务类型的请求参数请查阅 ',
        'resolution_duration_tooltip': '每个模型支持的时长和分辨率各不相同,请参考 ',
        'aspect_ratio_tooltip': '只有文生视频和参考生视频支持选择视频比例',
        'style_tooltip': '只有文生视频支持风格选择',
      },
      'en-US': {
        'vidu_label': 'Vidu AI Video Generator',
        'env': 'API Environment',
        'prod': 'China',
        'prod_s': 'Global',
        'task_type': 'Task Type',
        'model': 'Model Selection',
        'images': 'Images Input',
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
        'api_key_tooltip': 'For obtaining the API key, please refer to ',
        'style_placeholder': 'Only text-to-video supports style selection',
        'images_tooltip': 'Each task type supports different number of images, please refer to ',
        'task_type_tooltip': 'Please check the request parameters for each task type: ',
        'resolution_duration_tooltip': 'Each model supports different durations and resolutions, please refer to ',
        'aspect_ratio_tooltip': 'Only text-to-video and reference-to-video support selecting aspect ratio',
        'style_tooltip': 'Only text-to-video supports style selection',
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
      tooltips: [
        {
          type: 'text',
          content: t('task_type_tooltip')
        },
        {
          type: 'link',
          text: 'Vidu Docs',
          link: 'https://platform.vidu.cn/docs/introduction'
        }
      ],
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
      tooltips: [
        {
          type: 'text',
          content: t('images_tooltip')
        },
        {
          type: 'link',
          text: 'Vidu Docs',
          link: 'https://platform.vidu.cn/docs/introduction'
        }
      ],
      props: {
        supportType: [FieldType.Attachment],
        mode: 'multiple',
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'duration',
      label: t('duration'),
      component: FieldComponent.SingleSelect,
      tooltips: [
        {
          type: 'text',
          content: t('resolution_duration_tooltip')
        },
        {
          type: 'link',
          text: 'Price Docs',
          link: 'https://platform.vidu.cn/docs/pricing'
        }
      ],
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
      tooltips: [
        {
          type: 'text',
          content: t('resolution_duration_tooltip')
        },
        {
          type: 'link',
          text: 'Price Docs',
          link: 'https://platform.vidu.cn/docs/pricing'
        }
      ],
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
      component: FieldComponent.SingleSelect,
      tooltips: [
        {
          type: 'text',
          content: t('aspect_ratio_tooltip')
        }
      ],
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
      key: 'bgm',
      label: t('bgm'),
      component: FieldComponent.SingleSelect,
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
      key: 'style',
      label: t('style'),
      component: FieldComponent.SingleSelect,
      tooltips: [
        {
          type: 'text',
          content: t('style_tooltip')
        }
      ],
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
      aspect_ratio,
      bgm,
      style,
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
        prompt, 
        imageUrls, 
        duration?.value, 
        resolution?.value, 
        aspect_ratio?.value,
        style?.value,
        movementAmplitude?.value,
        bgm?.value,
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
          name: `${taskId}.mp4`,
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
  prompt: string, 
  images?: string[], 
  duration?: number, 
  resolution?: string, 
  aspect_ratio?: string,
  style?: string,
  movementAmplitude?: string,
  bgm?: boolean,
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
      aspect_ratio,
      style: style as 'general' | 'anime',
      movement_amplitude: movementAmplitude as 'auto' | 'small' | 'medium' | 'large',
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
      const error = await response.text();
      throw new Error(`图生视频API调用失败: ${error}`);
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
function extractImageUrls(images: any[]): string[] | undefined {
  try {
    if (!images) {
      return;
    }
    
    const imageUrls = images.map((imageAttachments) => imageAttachments.map((image) => image.tmp_url));
    return imageUrls.flat().filter((url) => url !== undefined);
  } catch (error: any) {
    throw new Error(`提取图片URL失败: ${error.message}`);
  }
}

export default basekit;