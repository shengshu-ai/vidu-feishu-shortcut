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
  STARTEND2VIDEO = 'startend2video',
  REFERENCE2IMAGE = 'reference2image',
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
  [ViduTaskType.STARTEND2VIDEO]: 'ent/v2/start-end2video',
  [ViduTaskType.REFERENCE2IMAGE]: 'ent/v2/reference2image'
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
  watermark?: boolean;
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
      label: "Vidu Api Key",
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
        'images_tooltip': '支持1 ~ 7张图片输入',
        'task_type_tooltip': '每种任务类型的请求参数请查阅 ',
        'resolution_duration_tooltip': '每个模型支持的时长和分辨率各不相同,请参考 ',
        'aspect_ratio_tooltip': '推荐选择和输入图片接近的比例',
        'style_tooltip': '只有文生视频支持风格选择',
        'watermark': '水印',
        'watermark_on': '开启',
        'watermark_off': '关闭',
      },
      'en-US': {
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
        'images_tooltip': 'Supports 1 ~ 7 images input',
        'task_type_tooltip': 'Please check the request parameters for each task type: ',
        'resolution_duration_tooltip': 'Each model supports different durations and resolutions, please refer to ',
        'aspect_ratio_tooltip': 'Recommend selecting the ratio closest to the input image',
        'style_tooltip': 'Only text-to-video supports style selection',
        'watermark': 'Watermark',
        'watermark_on': 'On',
        'watermark_off': 'Off',
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
      key: 'model',
      label: t('model'),
      component: FieldComponent.SingleSelect,
      defaultValue: { label: t('viduq1'), value: ViduModel.VIDUQ1 },
      props: {
        options: [
          { label: 'Vidu Q1', value: ViduModel.VIDUQ1 },
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
        }
      ],
      props: {
        supportType: [FieldType.Attachment],
        mode: 'multiple',
      },
      validator: {
        required: true,
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
      defaultValue: { label: '16:9', value: '16:9' },
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
      key: 'watermark',
      label: t('watermark'),
      component: FieldComponent.SingleSelect,
      defaultValue: { label: t('watermark_on'), value: true },
      props: {
        options: [
          { label: t('watermark_on'), value: true },
          { label: t('watermark_off'), value: false }
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
      model,
      prompt, 
      images,  
      aspect_ratio,
      watermark,
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
        ViduTaskType.REFERENCE2IMAGE,
        model.value, 
        prompt, 
        imageUrls, 
        undefined, // duration
        undefined, // resolution
        aspect_ratio?.value, // aspect_ratio
        undefined, // style
        undefined, // movementAmplitude
        undefined, // bgm
        watermark?.value, // watermark
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
          name: `${taskId}.png`,
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
  watermark?: boolean,
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
      watermark,
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
      throw new Error(`API调用失败: ${error}`);
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
      throw new Error(`生成视频失败: ${data.err_code}`);
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
    
    const imageUrls = images
      .filter((imageAttachments) => imageAttachments && Array.isArray(imageAttachments))
      .map((imageAttachments) => imageAttachments.map((image) => image.tmp_url));
    return imageUrls.flat().filter((url) => url !== undefined);
  } catch (error: any) {
    throw new Error(`提取图片URL失败: ${error.message}`);
  }
}

export default basekit;