import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { t } = field;

// 添加Vidu API域名到白名单
basekit.addDomainList([
  'feishu.cn', 
  'feishucdn.com', 
  'larksuitecdn.com', 
  'larksuite.com',
  'api.vidu.cn' // Vidu API域名
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

// 定义环境变量类型
interface EnvConfig {
  VIDU_API_KEY: string;
  VIDU_API_URL: string;
}

// 获取环境配置
function getEnvConfig(): EnvConfig {
  const config = {
    VIDU_API_KEY: process.env['VIDU_API_KEY'] || '',
    VIDU_API_URL: process.env['VIDU_API_URL'] || 'https://api.vidu.cn'
  };
  
  if (!config.VIDU_API_KEY) {
    throw new Error('VIDU_API_KEY 环境变量未设置');
  }
  
  return config;
}

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
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
        'small': '小幅',
        'medium': '中幅',
        'large': '大幅'
      },
      'en-US': {
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
        'large': 'Large'
      }
    }
  },
  
  // 定义捷径的入参
  formItems: [
    {
      key: 'taskType',
      label: t('task_type'),
      component: FieldComponent.FieldSelect,
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
      component: FieldComponent.FieldSelect,
      props: {
        options: [
          { label: t('viduq1'), value: ViduModel.VIDUQ1 },
          { label: t('vidu1_5'), value: ViduModel.VIDU1_5 },
          { label: t('vidu2_0'), value: ViduModel.VIDU2_0 }
        ]
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'images',
      label: t('images'),
      component: FieldComponent.FieldAttachment,
      props: {
        supportType: [FieldType.Attachment],
        multiple: true,
        maxCount: 7
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'prompt',
      label: t('prompt'),
      component: FieldComponent.FieldTextArea,
      props: {
        placeholder: '请输入视频生成的提示词描述...',
        maxLength: 1500
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'style',
      label: t('style'),
      component: FieldComponent.FieldSelect,
      props: {
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
      key: 'duration',
      label: t('duration'),
      component: FieldComponent.FieldSelect,
      props: {
        options: [
          { label: '4秒', value: 4 },
          { label: '5秒', value: 5 },
          { label: '8秒', value: 8 }
        ]
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'resolution',
      label: t('resolution'),
      component: FieldComponent.FieldSelect,
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
      component: FieldComponent.FieldSelect,
      props: {
        options: [
          { label: t('auto'), value: 'auto' },
          { label: t('small'), value: 'small' },
          { label: t('medium'), value: 'medium' },
          { label: t('large'), value: 'large' }
        ]
      },
      validator: {
        required: false,
      }
    }
  ],
  
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'task_id',
          type: FieldType.Text,
          label: t('task_id'),
          primary: true,
        },
        {
          key: 'status',
          type: FieldType.Text,
          label: t('status'),
        },
        {
          key: 'video_url',
          type: FieldType.Attachment,
          label: t('video_url'),
        },
        {
          key: 'cover_url',
          type: FieldType.Attachment,
          label: t('cover_url'),
        }
      ],
    },
  },
  
  // 主要执行逻辑
  execute: async (formItemParams: any, context: any) => {
    const { 
      taskType, 
      model, 
      images, 
      prompt, 
      style = 'general',
      duration = 4, 
      resolution = '720p',
      movementAmplitude = 'auto'
    } = formItemParams;

    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      // @ts-ignore
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }

    try {
      debugLog({
        '===1 开始执行Vidu API调用': {
          taskType,
          model,
          imagesCount: images?.length || 0,
          prompt,
          style,
          duration,
          resolution,
          movementAmplitude
        }
      });

      // 验证图片数量
      if (!images || images.length === 0) {
        throw new Error('请至少上传一张图片');
      }

      // 根据任务类型验证图片数量
      if (taskType === ViduTaskType.STARTEND2VIDEO && images.length !== 2) {
        throw new Error('首尾帧生视频需要上传2张图片（开始帧和结束帧）');
      }

      if (taskType === ViduTaskType.REFERENCE2VIDEO && (images.length < 1 || images.length > 3)) {
        throw new Error('参考生视频需要上传1-3张图片');
      }

      // 根据任务类型调用不同的Vidu API
      let result;
      switch (taskType) {
        case ViduTaskType.IMG2VIDEO:
          result = await callViduImg2Video(model, images, prompt, style, duration, resolution, movementAmplitude, context);
          break;
        case ViduTaskType.REFERENCE2VIDEO:
          result = await callViduReference2Video(model, images, prompt, style, duration, resolution, movementAmplitude, context);
          break;
        case ViduTaskType.STARTEND2VIDEO:
          result = await callViduStartEnd2Video(model, images, prompt, style, duration, resolution, movementAmplitude, context);
          break;
        default:
          throw new Error(`不支持的任务类型: ${taskType}`);
      }

      debugLog({
        '===2 Vidu API调用结果': result
      });

      return result;

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
async function callViduImg2Video(
  model: string, 
  images: any[], 
  prompt: string, 
  style: string,
  duration: number, 
  resolution: string, 
  movementAmplitude: string,
  context: any
): Promise<any> {
  try {
    const config = getEnvConfig();
    const imageUrls = await extractImageUrls(images, context);
    
    const requestData: ViduApiRequest = {
      model,
      style: style as 'general' | 'anime',
      prompt,
      images: imageUrls,
      duration,
      resolution,
      movement_amplitude: movementAmplitude as 'auto' | 'small' | 'medium' | 'large'
    };

    const response = await axios.post<ViduApiResponse>(
      `${config.VIDU_API_URL}/ent/v2/img2video`,
      requestData,
      {
        headers: {
          'Authorization': config.VIDU_API_KEY,
          'Content-Type': 'application/json',
          'X-Request-ID': uuidv4()
        }
      }
    );

    return {
      task_id: response.data.task_id,
      status: response.data.state,
      video_url: '',
      cover_url: ''
    };
  } catch (error: any) {
    throw new Error(`图生视频API调用失败: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * 调用Vidu参考生视频API
 */
async function callViduReference2Video(
  model: string, 
  images: any[], 
  prompt: string, 
  style: string,
  duration: number, 
  resolution: string, 
  movementAmplitude: string,
  context: any
): Promise<any> {
  try {
    const config = getEnvConfig();
    const imageUrls = await extractImageUrls(images, context);
    
    const requestData: ViduApiRequest = {
      model,
      style: style as 'general' | 'anime',
      prompt,
      images: imageUrls,
      duration,
      resolution,
      movement_amplitude: movementAmplitude as 'auto' | 'small' | 'medium' | 'large'
    };

    const response = await axios.post<ViduApiResponse>(
      `${config.VIDU_API_URL}/ent/v2/reference2video`,
      requestData,
      {
        headers: {
          'Authorization': config.VIDU_API_KEY,
          'Content-Type': 'application/json',
          'X-Request-ID': uuidv4()
        }
      }
    );

    return {
      task_id: response.data.task_id,
      status: response.data.state,
      video_url: '',
      cover_url: ''
    };
  } catch (error: any) {
    throw new Error(`参考生视频API调用失败: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * 调用Vidu首尾帧生视频API
 */
async function callViduStartEnd2Video(
  model: string, 
  images: any[], 
  prompt: string, 
  style: string,
  duration: number, 
  resolution: string, 
  movementAmplitude: string,
  context: any
): Promise<any> {
  try {
    const config = getEnvConfig();
    const imageUrls = await extractImageUrls(images, context);
    
    const requestData: ViduApiRequest = {
      model,
      style: style as 'general' | 'anime',
      prompt,
      images: imageUrls,
      duration,
      resolution,
      movement_amplitude: movementAmplitude as 'auto' | 'small' | 'medium' | 'large'
    };

    const response = await axios.post<ViduApiResponse>(
      `${config.VIDU_API_URL}/ent/v2/start-end2video`,
      requestData,
      {
        headers: {
          'Authorization': config.VIDU_API_KEY,
          'Content-Type': 'application/json',
          'X-Request-ID': uuidv4()
        }
      }
    );

    return {
      task_id: response.data.task_id,
      status: response.data.state,
      video_url: '',
      cover_url: ''
    };
  } catch (error: any) {
    throw new Error(`首尾帧生视频API调用失败: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * 从飞书附件中提取图片URL
 */
async function extractImageUrls(images: any[], context: any): Promise<string[]> {
  try {
    const imageUrls: string[] = [];
    
    for (const image of images) {
      if (image.token) {
        // 使用飞书API获取文件下载链接
        const downloadUrl = await getFeishuFileDownloadUrl(image.token, context);
        if (downloadUrl) {
          imageUrls.push(downloadUrl);
        }
      } else if (image.url) {
        // 直接使用URL
        imageUrls.push(image.url);
      }
    }
    
    if (imageUrls.length === 0) {
      throw new Error('无法获取图片URL');
    }
    
    return imageUrls;
  } catch (error: any) {
    throw new Error(`提取图片URL失败: ${error.message}`);
  }
}

/**
 * 获取飞书文件下载链接
 */
async function getFeishuFileDownloadUrl(fileToken: string, context: any): Promise<string> {
  try {
    // 这里需要根据飞书API文档实现获取文件下载链接的逻辑
    // 由于飞书API需要应用凭证，这里先返回一个占位符
    // 实际使用时需要实现完整的飞书API调用
    
    // 示例实现（需要根据实际情况调整）
    const appId = process.env['APP_ID'];
    const appSecret = process.env['APP_SECRET'];
    
    if (!appId || !appSecret) {
      throw new Error('飞书应用配置未设置');
    }
    
    // 获取访问令牌
    const tokenResponse = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: appId,
      app_secret: appSecret
    });
    
    const accessToken = tokenResponse.data.tenant_access_token;
    
    // 获取文件下载链接
    const fileResponse = await axios.get(`https://open.feishu.cn/open-apis/drive/v1/files/${fileToken}/download`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return fileResponse.data.data.link;
  } catch (error: any) {
    console.error('获取飞书文件下载链接失败:', error);
    // 如果获取失败，返回原始token作为备用方案
    return `https://open.feishu.cn/open-apis/drive/v1/files/${fileToken}/download`;
  }
} 