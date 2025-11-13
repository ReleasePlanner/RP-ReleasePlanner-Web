{{/*
Expand the name of the chart.
*/}}
{{- define "my-app-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "my-app-chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "my-app-chart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "my-app-chart.labels" -}}
helm.sh/chart: {{ include "my-app-chart.chart" . }}
{{ include "my-app-chart.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Redis labels
*/}}
{{- define "my-app-chart.redis.labels" -}}
helm.sh/chart: {{ include "my-app-chart.chart" . }}
{{ include "my-app-chart.redis.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/component: redis
{{- end }}

{{/*
Redis selector labels
*/}}
{{- define "my-app-chart.redis.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-app-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: redis
{{- end }}

{{/*
Redis fullname
*/}}
{{- define "my-app-chart.redis.fullname" -}}
{{- printf "%s-redis" (include "my-app-chart.fullname" .) }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "my-app-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-app-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "my-app-chart.frontend.labels" -}}
{{ include "my-app-chart.labels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "my-app-chart.frontend.selectorLabels" -}}
{{ include "my-app-chart.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
API labels
*/}}
{{- define "my-app-chart.api.labels" -}}
{{ include "my-app-chart.labels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
API selector labels
*/}}
{{- define "my-app-chart.api.selectorLabels" -}}
{{ include "my-app-chart.selectorLabels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
PostgreSQL labels
*/}}
{{- define "my-app-chart.postgresql.labels" -}}
{{ include "my-app-chart.labels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
PostgreSQL selector labels
*/}}
{{- define "my-app-chart.postgresql.selectorLabels" -}}
{{ include "my-app-chart.selectorLabels" . }}
app.kubernetes.io/component: postgresql
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "my-app-chart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "my-app-chart.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Get PostgreSQL secret name
*/}}
{{- define "my-app-chart.postgresql.secretName" -}}
{{- if .Values.postgresql.auth.existingSecret }}
{{- .Values.postgresql.auth.existingSecret }}
{{- else }}
{{- printf "%s-postgresql-secret" (include "my-app-chart.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Create the name of the JWT secret
*/}}
{{- define "my-app-chart.jwt.secretName" -}}
{{- printf "%s-jwt-secret" (include "my-app-chart.fullname" .) }}
{{- end }}

{{/*
Get PostgreSQL connection string
*/}}
{{- define "my-app-chart.postgresql.connectionString" -}}
postgresql://{{ .Values.postgresql.auth.username }}:$(POSTGRES_PASSWORD)@{{ include "my-app-chart.postgresql.fullname" . }}:{{ .Values.postgresql.service.port }}/{{ .Values.postgresql.auth.database }}
{{- end }}

{{/*
PostgreSQL fullname
*/}}
{{- define "my-app-chart.postgresql.fullname" -}}
{{- printf "%s-postgresql" (include "my-app-chart.fullname" .) }}
{{- end }}

{{/*
Frontend fullname
*/}}
{{- define "my-app-chart.frontend.fullname" -}}
{{- printf "%s-frontend" (include "my-app-chart.fullname" .) }}
{{- end }}

{{/*
API fullname
*/}}
{{- define "my-app-chart.api.fullname" -}}
{{- printf "%s-api" (include "my-app-chart.fullname" .) }}
{{- end }}

{{/*
Image registry
*/}}
{{- define "my-app-chart.imageRegistry" -}}
{{- if .Values.global.imageRegistry }}
{{- printf "%s/" .Values.global.imageRegistry }}
{{- end }}
{{- end }}

