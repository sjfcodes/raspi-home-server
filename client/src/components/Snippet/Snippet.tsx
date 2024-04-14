import './snippet.css';

type Props = { className?: string; text: string };
export default function Snippet({ className = '', text }: Props) {
    if (!text) return null;
    const classNames = ['snippet', className];
    return (
        <pre className={classNames.join(' ')}>
            <code>{text}</code>
        </pre>
    );
}
