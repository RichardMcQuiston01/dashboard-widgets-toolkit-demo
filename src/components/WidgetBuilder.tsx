import {
  providerKeyOf,
  type WidgetDefinition,
} from '@richardmcquiston01/dashboard-widgets-toolkit';
import {
  newWidget,
  uniqueWidgetKey,
  validateViewerSave,
  viewerSources,
  viewerWidgetKey,
  type BuilderPolicy,
  type PatchableField,
  type SourceDescription,
} from '@richardmcquiston01/dashboard-widgets-toolkit/builder';
import {
  Dashboard,
  WidgetOptionsForm,
  WidgetPreview,
  WidgetSettingsProvider,
  WidgetViewsForm,
  useWidgetDraft,
  useWidgets,
  type DetailExportRequest,
  type DetailLoader,
  type WidgetDraft,
} from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import type { WidgetThemeStyles } from '@richardmcquiston01/dashboard-widgets-toolkit';
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ReactElement,
} from 'react';

import {
  builderSources,
  clearBuilderWidgets,
  clearViewerWidgets,
  findBuilderSource,
  readBuilderWidgets,
  readViewerWidgets,
  viewerPolicy,
  writeBuilderWidgets,
  writeViewerWidgets,
  type StoredBuilderWidgets,
} from '../data/builderSources';
import {
  loadWidgetDetail,
  widgetDefinitions,
  widgetProviders,
  type ShopContext,
} from '../data/widgets';

const fieldClass: string =
  'mt-1 w-full rounded-md border border-brand-200 bg-white p-2 text-sm dark:border-brand-700 dark:bg-brand-900';
const buttonClass: string =
  'rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm hover:bg-brand-50 disabled:cursor-default disabled:opacity-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800';
const primaryButtonClass: string =
  'rounded-md border border-brand-600 bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:cursor-default disabled:opacity-50';
const errorClass: string = 'mt-1 text-sm text-rose-700 dark:text-rose-300';

const WIDTHS: readonly number[] = [3, 4, 6, 8, 12];

/** The detail setting a source allows: its mode when it fixes one. */
function detailFor(source: SourceDescription): WidgetDefinition['detail'] {
  if (typeof source.detail === 'object' && source.detail.mode !== undefined) {
    return {
      mode: source.detail.mode,
      pageSize: 10,
      pageSizes: [10, 25, 50],
      columnVisibility: true,
    };
  }
  return true;
}

function hasDetail(source: SourceDescription): boolean {
  return source.detail !== undefined && source.detail !== false;
}

interface EditorProps {
  readonly source: SourceDescription;
  readonly definition: WidgetDefinition;
  readonly isNew: boolean;
  readonly theme: WidgetThemeStyles | undefined;
  /** A viewer's policy: the form follows it, and Save asks the "server" first. */
  readonly policy: BuilderPolicy | undefined;
  /** The viewer's stored widgets, for the quota the server checks. */
  readonly owned: readonly WidgetDefinition[];
  readonly onSave: (definition: WidgetDefinition, note?: string) => void;
  readonly onCancel: () => void;
}

/** One widget's form: plain fields, options, views and a live preview. */
function WidgetEditor({
  source,
  definition,
  isNew,
  theme,
  policy,
  owned,
  onSave,
  onCancel,
}: EditorProps): ReactElement {
  const draft: WidgetDraft = useWidgetDraft(
    source,
    definition,
    policy === undefined ? {} : { policy }
  );
  const can = (field: PatchableField): boolean =>
    draft.editable.includes(field);
  const [serverSays, setServerSays] = useState<string | undefined>(undefined);
  const [previewView, setPreviewView] = useState<string | undefined>(undefined);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const id: string = useId();
  const current: WidgetDefinition = draft.candidate;
  const problems: Readonly<Record<string, string>> = draft.problems;
  const views = draft.definition.views ?? [];
  const title: string = draft.patch.title ?? draft.definition.title;
  const description: string =
    draft.patch.description ?? draft.definition.description ?? '';
  const width: number | undefined =
    'width' in draft.patch ? draft.patch.width : draft.definition.width;
  const locked: boolean =
    ('locked' in draft.patch ? draft.patch.locked : draft.definition.locked) ===
    true;
  const detailOn: boolean = (
    'detail' in draft.patch ? draft.patch.detail : draft.definition.detail
  )
    ? true
    : false;
  const defaultView: string =
    ('defaultView' in draft.patch
      ? draft.patch.defaultView
      : draft.definition.defaultView) ?? 'base';

  function save(): void {
    const committed = draft.commit();
    if (!committed.ok) {
      setSaveError(committed.error);
      return;
    }
    setSaveError(undefined);
    if (policy === undefined) {
      onSave(committed.value);
      return;
    }
    // The demo has no server, so ask the same check a server would run.
    const verdict = validateViewerSave({
      policy,
      sources: builderSources,
      submitted: committed.value,
      previous: isNew ? undefined : definition,
      owned,
    });
    if (!verdict.ok) {
      setSaveError(`The server refused it: ${verdict.error}`);
      return;
    }
    onSave(
      verdict.value,
      'The server’s check (validateViewerSave) accepted it.'
    );
  }

  /** What a tampered browser could send; the server's check answers. */
  function tamper(kind: 'roles' | 'key'): void {
    const sent: unknown =
      kind === 'roles'
        ? { ...draft.definition, roles: ['admin'], locked: true }
        : { ...draft.definition, key: 'u-someone-else-widget' };
    const verdict = validateViewerSave({
      policy: policy as BuilderPolicy,
      sources: builderSources,
      submitted: sent,
      previous: isNew ? undefined : definition,
      owned,
    });
    setServerSays(
      verdict.ok
        ? 'The server accepted it (unexpected).'
        : `The server refused it: ${verdict.error}`
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-brand-200 p-4 dark:border-brand-700">
      <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-200">
        {isNew ? 'New widget' : `Edit “${draft.definition.title}”`} · source{' '}
        <code>{source.key}</code>
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {source.description ?? source.label} Every change is checked against
        what this source offers, so the widget can never ask for more than the
        provider can give.
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor={`${id}-title`} className="text-sm font-medium">
              Title
            </label>
            <input
              id={`${id}-title`}
              type="text"
              className={fieldClass}
              value={title}
              aria-invalid={problems['title'] !== undefined}
              onChange={(event) => draft.setField('title', event.target.value)}
            />
            {problems['title'] !== undefined && (
              <p role="alert" className={errorClass}>
                {problems['title']}
              </p>
            )}
          </div>
          {can('description') && (
            <div>
              <label htmlFor={`${id}-desc`} className="text-sm font-medium">
                Description
              </label>
              <input
                id={`${id}-desc`}
                type="text"
                className={fieldClass}
                value={description}
                onChange={(event) =>
                  draft.setField(
                    'description',
                    event.target.value === '' ? undefined : event.target.value
                  )
                }
              />
              {problems['description'] !== undefined && (
                <p role="alert" className={errorClass}>
                  {problems['description']}
                </p>
              )}
            </div>
          )}
          {can('width') && (
            <div>
              <label htmlFor={`${id}-width`} className="text-sm font-medium">
                Width
              </label>
              <select
                id={`${id}-width`}
                className={fieldClass}
                value={width === undefined ? '' : String(width)}
                onChange={(event) =>
                  draft.setField(
                    'width',
                    event.target.value === ''
                      ? undefined
                      : Number(event.target.value)
                  )
                }
              >
                <option value="">Default</option>
                {WIDTHS.map((option) => (
                  <option key={option} value={String(option)}>
                    {option} of 12 columns
                  </option>
                ))}
              </select>
              {problems['width'] !== undefined && (
                <p role="alert" className={errorClass}>
                  {problems['width']}
                </p>
              )}
            </div>
          )}
          {hasDetail(source) && can('detail') && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={detailOn}
                onChange={(event) =>
                  draft.setField(
                    'detail',
                    event.target.checked ? detailFor(source) : undefined
                  )
                }
              />
              Offer a detail view (the eye button)
            </label>
          )}
          {can('locked') && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={locked}
                onChange={(event) =>
                  draft.setField(
                    'locked',
                    event.target.checked ? true : undefined
                  )
                }
              />
              Lock it: viewers can’t move, hide or change it
            </label>
          )}
          {views.length > 0 && can('defaultView') && (
            <div>
              <label htmlFor={`${id}-view`} className="text-sm font-medium">
                Shown first
              </label>
              <select
                id={`${id}-view`}
                className={fieldClass}
                value={defaultView}
                onChange={(event) =>
                  draft.setField(
                    'defaultView',
                    event.target.value === 'base'
                      ? undefined
                      : event.target.value
                  )
                }
              >
                <option value="base">As the source returns it</option>
                {views.map((view) => (
                  <option key={view.key} value={view.key}>
                    {view.label}
                  </option>
                ))}
              </select>
              {problems['defaultView'] !== undefined && (
                <p role="alert" className={errorClass}>
                  {problems['defaultView']}
                </p>
              )}
            </div>
          )}
          {problems[''] !== undefined && (
            <p role="alert" className={errorClass}>
              {problems['']}
            </p>
          )}
          <WidgetOptionsForm draft={draft} />
          <WidgetViewsForm draft={draft} />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Preview</h4>
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
            Drawn from the source’s sample data, with no provider call, as you
            type. Options your provider applies (like how many rows) can’t show
            here; sorting, columns and views can.
          </p>
          {views.length > 0 && (
            <div className="mb-2">
              <label htmlFor={`${id}-pview`} className="text-sm font-medium">
                Preview view
              </label>
              <select
                id={`${id}-pview`}
                className={fieldClass}
                value={previewView ?? ''}
                onChange={(event) =>
                  setPreviewView(
                    event.target.value === '' ? undefined : event.target.value
                  )
                }
              >
                <option value="">The one shown first</option>
                <option value="base">As the source returns it</option>
                {views.map((view) => (
                  <option key={view.key} value={view.key}>
                    {view.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <WidgetPreview
            source={source}
            definition={current}
            {...(previewView === undefined ? {} : { view: previewView })}
            {...(theme === undefined ? {} : { theme })}
          />
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-medium">
              The JSON that gets saved
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-100 p-3 text-xs dark:bg-brand-900">
              {JSON.stringify(draft.definition, null, 2)}
            </pre>
          </details>
        </div>
      </div>
      {saveError !== undefined && (
        <p role="alert" className={errorClass}>
          {saveError}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button type="button" className={primaryButtonClass} onClick={save}>
          Save widget
        </button>
        <button type="button" className={buttonClass} onClick={onCancel}>
          Cancel
        </button>
      </div>
      {policy !== undefined && (
        <div className="mt-4 rounded-md border border-brand-200 p-3 text-sm dark:border-brand-700">
          <p className="font-medium">Try to cheat</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            The form only offers what your policy allows, but a browser can send
            anything. Send these to the server’s check:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonClass}
              onClick={() => tamper('roles')}
            >
              Add roles and a lock
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => tamper('key')}
            >
              Use someone else’s key
            </button>
          </div>
          {serverSays !== undefined && (
            <p role="status" className="mt-2">
              {serverSays}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface LiveProps {
  readonly definitions: readonly WidgetDefinition[];
  readonly context: ShopContext;
  readonly theme: WidgetThemeStyles | undefined;
}

/**
 * The saved widgets on a real dashboard. They name their provider in `source`,
 * so they load through the providers the demo already registers.
 */
function SavedWidgets({
  definitions,
  context,
  theme,
}: LiveProps): ReactElement {
  const { widgets, refresh } = useWidgets(
    definitions,
    widgetProviders,
    context
  );
  const loadDetail: DetailLoader = useCallback(
    (definition, { signal, query }) =>
      loadWidgetDetail(providerKeyOf(definition), context, signal, query),
    [context]
  );
  const exportDetail = useCallback(
    (request: DetailExportRequest) => {
      const definition: WidgetDefinition | undefined = definitions.find(
        (candidate) => candidate.key === request.widgetKey
      );
      return loadWidgetDetail(
        definition === undefined
          ? request.widgetKey
          : providerKeyOf(definition),
        context,
        new AbortController().signal,
        request.query
      );
    },
    [context, definitions]
  );
  if (definitions.length === 0) {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        No saved widgets yet. Make one above.
      </p>
    );
  }
  return (
    <WidgetSettingsProvider locale={context.locale} linkTarget="_blank">
      <Dashboard
        widgets={widgets}
        freshness
        onRefresh={refresh}
        onRetry={refresh}
        exportFormats={['csv', 'svg', 'png']}
        loadDetail={loadDetail}
        onExportDetail={exportDetail}
        {...(theme === undefined ? {} : { theme })}
      />
    </WidgetSettingsProvider>
  );
}

interface WidgetBuilderProps {
  readonly context: ShopContext;
  readonly theme: WidgetThemeStyles | undefined;
}

type Editing =
  | { readonly kind: 'new'; readonly definition: WidgetDefinition }
  | { readonly kind: 'edit'; readonly definition: WidgetDefinition };

type Mode = 'admin' | 'viewer';

interface WorkspaceProps extends WidgetBuilderProps {
  readonly mode: Mode;
}

/** One mode's widgets: create, edit and delete over the demo's sources. */
function BuilderWorkspace({
  mode,
  context,
  theme,
}: WorkspaceProps): ReactElement {
  const isViewer: boolean = mode === 'viewer';
  const policy: BuilderPolicy | undefined = isViewer ? viewerPolicy : undefined;
  const available: readonly SourceDescription[] = isViewer
    ? viewerSources(viewerPolicy, builderSources)
    : builderSources;
  const [stored, setStored] = useState<StoredBuilderWidgets>(
    isViewer ? readViewerWidgets : readBuilderWidgets
  );
  const [notice, setNotice] = useState<string | undefined>(undefined);
  const [definitions, setDefinitions] = useState<readonly WidgetDefinition[]>(
    stored.definitions
  );
  const [editing, setEditing] = useState<Editing | undefined>(undefined);
  const [sourceKey, setSourceKey] = useState<string>(available[0]?.key ?? '');
  const [newTitle, setNewTitle] = useState<string>('');
  const [createError, setCreateError] = useState<string | undefined>(undefined);
  const [storageError, setStorageError] = useState<string | undefined>(
    stored.error
  );
  const id: string = useId();
  const takenKeys: readonly string[] = useMemo(
    () => [
      ...widgetDefinitions.map((definition) => definition.key),
      ...definitions.map((definition) => definition.key),
    ],
    [definitions]
  );

  function persist(next: readonly WidgetDefinition[]): void {
    setDefinitions(next);
    setStorageError(
      isViewer ? writeViewerWidgets(next) : writeBuilderWidgets(next)
    );
  }

  function create(): void {
    const source: SourceDescription | undefined = findBuilderSource(sourceKey);
    if (source === undefined) {
      setCreateError(`Source ${JSON.stringify(sourceKey)} is not registered.`);
      return;
    }
    const title: string = newTitle.trim() === '' ? source.label : newTitle;
    const created = newWidget(source, {
      key: isViewer
        ? viewerWidgetKey(viewerPolicy, title, takenKeys)
        : uniqueWidgetKey(`builder-${title.toLowerCase()}`, takenKeys),
      title,
    });
    if (!created.ok) {
      setCreateError(created.error);
      return;
    }
    setCreateError(undefined);
    setNewTitle('');
    setEditing({ kind: 'new', definition: created.value });
  }

  function save(definition: WidgetDefinition, note?: string): void {
    setNotice(note);
    const exists: boolean = definitions.some(
      (candidate) => candidate.key === definition.key
    );
    persist(
      exists
        ? definitions.map((candidate) =>
            candidate.key === definition.key ? definition : candidate
          )
        : [...definitions, definition]
    );
    setEditing(undefined);
  }

  function remove(key: string): void {
    persist(definitions.filter((definition) => definition.key !== key));
    if (editing?.definition.key === key) setEditing(undefined);
  }

  function restoreExamples(): void {
    const problem: string | undefined = isViewer
      ? clearViewerWidgets()
      : clearBuilderWidgets();
    const fresh: StoredBuilderWidgets = isViewer
      ? readViewerWidgets()
      : readBuilderWidgets();
    setNotice(undefined);
    setStored(fresh);
    setDefinitions(fresh.definitions);
    setEditing(undefined);
    setStorageError(problem ?? fresh.error);
  }

  const editingSource: SourceDescription | undefined =
    editing === undefined
      ? undefined
      : findBuilderSource(editing.definition.source ?? '');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`${id}-source`} className="text-sm font-medium">
            Data source
          </label>
          <select
            id={`${id}-source`}
            className={fieldClass}
            value={sourceKey}
            onChange={(event) => setSourceKey(event.target.value)}
          >
            {available.map((source) => (
              <option key={source.key} value={source.key}>
                {source.label} ({source.kind})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-title`} className="text-sm font-medium">
            Title
          </label>
          <input
            id={`${id}-title`}
            type="text"
            className={fieldClass}
            value={newTitle}
            placeholder={findBuilderSource(sourceKey)?.label ?? ''}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </div>
        <button type="button" className={primaryButtonClass} onClick={create}>
          New widget
        </button>
        <button type="button" className={buttonClass} onClick={restoreExamples}>
          {isViewer ? 'Delete all mine' : 'Restore the examples'}
        </button>
      </div>
      {isViewer && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Signed in as a viewer. Your policy: {viewerPolicy.sources.length} of{' '}
          {builderSources.length} sources, up to {viewerPolicy.maxWidgets}{' '}
          widgets ({definitions.length} used), at most {viewerPolicy.maxOptions}{' '}
          options and {viewerPolicy.maxViews} view each, and only the title,
          description, width and first view to change. Keys start with{' '}
          <code>{viewerPolicy.keyPrefix}</code>.
        </p>
      )}
      {notice !== undefined && (
        <p
          role="status"
          className="text-sm text-emerald-700 dark:text-emerald-300"
        >
          Saved. {notice}
        </p>
      )}
      {createError !== undefined && (
        <p role="alert" className={errorClass}>
          {createError}
        </p>
      )}
      {storageError !== undefined && (
        <p role="alert" className={errorClass}>
          {storageError}
        </p>
      )}
      {stored.skipped.length > 0 && (
        <div role="status" className="text-sm">
          <p className="font-medium">
            {stored.skipped.length} saved widget(s) were left out:
          </p>
          <ul className="list-disc pl-5">
            {stored.skipped.map((skipped) => (
              <li key={skipped.key}>{skipped.error}</li>
            ))}
          </ul>
        </div>
      )}

      <section aria-labelledby={`${id}-list`}>
        <h3
          id={`${id}-list`}
          className="text-lg font-semibold text-brand-700 dark:text-brand-200"
        >
          Your widgets
        </h3>
        {definitions.length === 0 ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            None yet. Pick a source and press New widget.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-brand-100 rounded-md border border-brand-200 dark:divide-brand-800 dark:border-brand-700">
            {definitions.map((definition) => (
              <li
                key={definition.key}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
              >
                <span>
                  <strong>{definition.title}</strong>{' '}
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {definition.kind} from <code>{definition.source}</code>
                  </span>
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => setEditing({ kind: 'edit', definition })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={buttonClass}
                    onClick={() => remove(definition.key)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing !== undefined && editingSource !== undefined && (
        <WidgetEditor
          key={editing.definition.key}
          source={editingSource}
          definition={editing.definition}
          isNew={editing.kind === 'new'}
          theme={theme}
          policy={policy}
          owned={definitions}
          onSave={save}
          onCancel={() => setEditing(undefined)}
        />
      )}
      {editing !== undefined && editingSource === undefined && (
        <p role="alert" className={errorClass}>
          Widget {JSON.stringify(editing.definition.key)} names source{' '}
          {JSON.stringify(editing.definition.source)}, which is not registered.
        </p>
      )}

      <section aria-labelledby={`${id}-live`}>
        <h3
          id={`${id}-live`}
          className="mb-2 text-lg font-semibold text-brand-700 dark:text-brand-200"
        >
          On a dashboard
        </h3>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          The saved widgets, loaded through the demo’s own providers (each
          widget’s <code>source</code> names its provider). Save a change above
          and the card follows.
        </p>
        <SavedWidgets
          definitions={definitions}
          context={context}
          theme={theme}
        />
      </section>
    </div>
  );
}

/** The Widget Builder tab: an administrator's builder and a viewer's, over the demo's sources. */
export function WidgetBuilder(props: WidgetBuilderProps): ReactElement {
  const [mode, setMode] = useState<Mode>('admin');
  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="Who is building"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="text-sm font-medium">Building as</span>
        {(['admin', 'viewer'] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            className={`${buttonClass} aria-pressed:border-brand-600 aria-pressed:bg-brand-600 aria-pressed:text-white`}
            onClick={() => setMode(option)}
          >
            {option === 'admin' ? 'Administrator' : 'Viewer'}
          </button>
        ))}
      </div>
      <BuilderWorkspace key={mode} mode={mode} {...props} />
    </div>
  );
}
