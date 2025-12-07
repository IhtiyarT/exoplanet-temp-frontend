/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerLoginRequest {
  login?: string;
  password?: string;
}

export interface HandlerPlanetInput {
  albedo?: number;
  description?: string;
  is_delete?: boolean;
  planet_title?: string;
}

export interface HandlerPlanetSystemInput {
  star_luminosity?: number;
  star_name?: string;
  star_type?: string;
}

export interface HandlerRegisterUserReq {
  login?: string;
  password?: string;
  role?: number;
}

export interface HandlerUpdateDistanceInput {
  planet_distance: number;
}

export interface HandlerUpdateProfileRequest {
  new_login?: string;
  new_password?: string;
}

export interface HandlerStatusInput {
  status?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title BMSTU LAB
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @baseUrl /api
 * @contact API Support <bitop@spatecon.ru> (https://vk.com/bmstu_schedule)
 *
 * BMSTU dia lab
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Возвращает список всех планет с возможностью поиска по названию
     *
     * @tags planets
     * @name PlanetList
     * @summary Получить список планет
     * @request GET:/api/planet
     */
    planetList: (
      query?: {
        /** Поисковый запрос (по названию планеты) */
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет черновик планетной системы текущего пользователя
     *
     * @tags planet-system
     * @name PlanetSystemDeleteDelete
     * @summary Удалить планетную систему
     * @request DELETE:/api/planet-system/delete
     * @secure
     */
    planetSystemDeleteDelete: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/delete`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о черновике планетной системы текущего пользователя
     *
     * @tags planet-system
     * @name PlanetSystemDraftIdList
     * @summary Получить ID черновика планетной системы
     * @request GET:/api/planet-system/draft/id
     * @secure
     */
    planetSystemDraftIdList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/draft/id`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список всех планетных систем (требуется авторизация)
     *
     * @tags planet-system
     * @name PlanetSystemListList
     * @summary Получить список планетных систем
     * @request GET:/api/planet-system/list
     * @secure
     */
    planetSystemListList: (
      query?: {
        /** Статус системы */
        system_status?: string;
        /** Начальная дата (YYYY-MM-DD) */
        start_date?: string;
        /** Конечная дата (YYYY-MM-DD) */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/list`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о планетной системе по её идентификатору
     *
     * @tags planet-system
     * @name PlanetSystemDetail
     * @summary Получить планетную систему по ID
     * @request GET:/api/planet-system/{system_id}
     * @secure
     */
    planetSystemDetail: (systemId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/${systemId}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о планетной системе (только для черновиков)
     *
     * @tags planet-system
     * @name PlanetSystemUpdate
     * @summary Обновить планетную систему
     * @request PUT:/api/planet-system/{system_id}
     * @secure
     */
    planetSystemUpdate: (
      systemId: number,
      input: HandlerPlanetSystemInput,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/${systemId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит черновик планетной системы в статус "Сформирована"
     *
     * @tags planet-system
     * @name PlanetSystemFormUpdate
     * @summary Сформировать заявку
     * @request PUT:/api/planet-system/{system_id}/form
     * @secure
     */
    planetSystemFormUpdate: (systemId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/${systemId}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает статус заявки (Завершена/Отклонена) - только для модераторов и админов
     *
     * @tags planet-system
     * @name PlanetSystemModerUpdate
     * @summary Установить статус модератора
     * @request PUT:/api/planet-system/{system_id}/moder
     * @secure
     */
    planetSystemModerUpdate: (
      systemId: number,
      input: HandlerStatusInput,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/${systemId}/moder`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о планетной системе включая список планет
     *
     * @tags planet-system
     * @name PlanetSystemPlanetsList
     * @summary Получить планетную систему с планетами по ID
     * @request GET:/api/planet-system/{system_id}/planets
     * @secure
     */
    planetSystemPlanetsList: (systemId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet-system/${systemId}/planets`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую планету (только для модераторов и админов)
     *
     * @tags planets
     * @name PlanetCreate
     * @summary Создать новую планету
     * @request POST:/api/planet/
     * @secure
     */
    planetCreate: (input: HandlerPlanetInput, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/`,
        method: "POST",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет планету в черновик планетной системы текущего пользователя
     *
     * @tags planets
     * @name PlanetAddCreate
     * @summary Добавить планету в систему
     * @request POST:/api/planet/add/{planet_id}
     * @secure
     */
    planetAddCreate: (planetId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/add/${planetId}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для планеты
     *
     * @tags planets
     * @name PlanetImageAddCreate
     * @summary Добавить изображение планеты
     * @request POST:/api/planet/image/add/{planet_id}
     */
    planetImageAddCreate: (
      planetId: number,
      data: {
        /** Изображение планеты */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/image/add/${planetId}`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о планете по её идентификатору
     *
     * @tags planets
     * @name PlanetDetail
     * @summary Получить планету по ID
     * @request GET:/api/planet/{planet_id}
     */
    planetDetail: (planetId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/${planetId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о планете (только для модераторов и админов)
     *
     * @tags planets
     * @name PlanetUpdate
     * @summary Обновить информацию о планете
     * @request PUT:/api/planet/{planet_id}
     * @secure
     */
    planetUpdate: (
      planetId: number,
      input: HandlerPlanetInput,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/${planetId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет планету (только для модераторов и админов)
     *
     * @tags planets
     * @name PlanetDelete
     * @summary Удалить планету
     * @request DELETE:/api/planet/{planet_id}
     * @secure
     */
    planetDelete: (planetId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/planet/${planetId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет расстояние до планеты в планетной системе (только для черновиков и создателя системы)
     *
     * @tags temperature-request
     * @name TemperatureReqPlanetUpdate
     * @summary Обновить расстояние до планеты
     * @request PUT:/api/temperature-req/{system_id}/planet/{planet_id}
     * @secure
     */
    temperatureReqPlanetUpdate: (
      systemId: number,
      planetId: number,
      input: HandlerUpdateDistanceInput,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/temperature-req/${systemId}/planet/${planetId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет планету из планетной системы (только для черновиков и создателя системы)
     *
     * @tags temperature-request
     * @name TemperatureReqPlanetDelete
     * @summary Удалить планету из системы
     * @request DELETE:/api/temperature-req/{system_id}/planet/{planet_id}
     * @secure
     */
    temperatureReqPlanetDelete: (
      systemId: number,
      planetId: number,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/temperature-req/${systemId}/planet/${planetId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет вход пользователя и возвращает JWT токен
     *
     * @tags user
     * @name UserLoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/api/user/login
     */
    userLoginCreate: (input: HandlerLoginRequest, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/user/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет выход пользователя и добавляет токен в черный список
     *
     * @tags user
     * @name UserLogoutCreate
     * @summary Выход из системы
     * @request POST:/api/user/logout
     * @secure
     */
    userLogoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/user/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные текущего пользователя
     *
     * @tags user
     * @name UserMeUpdate
     * @summary Обновить профиль пользователя
     * @request PUT:/api/user/me
     * @secure
     */
    userMeUpdate: (
      input: HandlerUpdateProfileRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/user/me`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает нового пользователя в системе
     *
     * @tags user
     * @name UserRegisterCreate
     * @summary Регистрация пользователя
     * @request POST:/api/user/register
     */
    userRegisterCreate: (
      input: HandlerRegisterUserReq,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/user/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о пользователе по ID
     *
     * @tags user
     * @name UserDetail
     * @summary Получить профиль пользователя
     * @request GET:/api/user/{user_id}
     * @secure
     */
    userDetail: (userId: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/api/user/${userId}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
